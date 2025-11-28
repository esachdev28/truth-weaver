import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claimText, claimUrl } = await req.json();
    
    if (!claimText && !claimUrl) {
      return new Response(
        JSON.stringify({ error: 'Either claimText or claimUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const authHeader = req.headers.get('Authorization');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client for auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from auth header
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    console.log('Verifying claim:', claimText || claimUrl);

    const prompt = `Analyze the following claim for credibility and potential misinformation:

Claim: ${claimText || ''}
${claimUrl ? `URL: ${claimUrl}` : ''}

Provide a detailed credibility assessment with:
1. Overall credibility score (0-100)
2. Verdict (VERIFIED, FALSE, MIXED, or UNVERIFIED)
3. Source reliability score (0-100)
4. Evidence strength score (0-100)
5. Consistency score (0-100)
6. Brief explanation of your assessment
7. Key evidence points (if any)

Return your response as JSON with these exact keys:
{
  "credibility_score": <number>,
  "verdict": "<string>",
  "source_reliability": <number>,
  "evidence_strength": <number>,
  "consistency": <number>,
  "explanation": "<string>",
  "evidence": ["<string>", ...]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fact-checker. Analyze claims objectively and provide credibility assessments in the requested JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log('AI response:', content);

    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, content];
      result = JSON.parse(jsonMatch[1] || content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to a default response
      result = {
        credibility_score: 50,
        verdict: 'UNVERIFIED',
        source_reliability: 50,
        evidence_strength: 50,
        consistency: 50,
        explanation: 'Unable to parse credibility assessment. Please try again.',
        evidence: []
      };
    }

    // Save to database if user is authenticated
    if (userId) {
      const { error: dbError } = await supabase
        .from('claims')
        .insert({
          user_id: userId,
          claim_text: claimText,
          claim_url: claimUrl,
          verdict: result.verdict,
          credibility_score: result.credibility_score,
          evidence: result.evidence || [],
          status: 'completed'
        });

      if (dbError) {
        console.error('Failed to save claim:', dbError);
      }
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in verify-claim function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});