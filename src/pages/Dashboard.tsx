import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Clock, CheckCircle, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [claimText, setClaimText] = useState("");
  const [claimUrl, setClaimUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVerify = async () => {
    if (!claimText && !claimUrl) {
      toast({
        title: "Input Required",
        description: "Please enter a claim or URL to verify",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('verify-claim', {
        body: { claimText, claimUrl }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your claim has been analyzed for credibility",
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify claim",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED': return 'text-success';
      case 'FALSE': return 'text-destructive';
      case 'MIXED': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">Verification Dashboard</h1>
            <p className="text-lg text-muted-foreground">Submit claims for AI-powered fact-checking and credibility analysis</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submission Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 rounded-2xl">
                <h2 className="font-display text-2xl font-bold mb-6">Submit for Verification</h2>
                
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Claim</TabsTrigger>
                    <TabsTrigger value="url">URL / Link</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="claim">Enter Claim or Statement</Label>
                      <Textarea
                        id="claim"
                        placeholder="Type or paste the claim you want to verify..."
                        value={claimText}
                        onChange={(e) => setClaimText(e.target.value)}
                        className="min-h-[200px] rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={handleVerify} 
                      disabled={loading}
                      className="w-full rounded-full py-6 text-lg font-semibold"
                    >
                      {loading ? "Analyzing..." : "Verify Claim"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="url">Enter URL or Link</Label>
                      <div className="flex gap-2">
                        <LinkIcon className="w-5 h-5 text-muted-foreground mt-3" />
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com/article..."
                          value={claimUrl}
                          onChange={(e) => setClaimUrl(e.target.value)}
                          className="flex-1 rounded-xl"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleVerify} 
                      disabled={loading}
                      className="w-full rounded-full py-6 text-lg font-semibold"
                    >
                      {loading ? "Analyzing..." : "Verify URL"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Results */}
              {result && (
                <Card className="p-6 rounded-2xl">
                  <h2 className="font-display text-2xl font-bold mb-6">Analysis Results</h2>
                  
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-muted rounded-xl">
                      <div className={`text-6xl font-bold mb-2 ${getVerdictColor(result.verdict)}`}>
                        {result.credibility_score}%
                      </div>
                      <div className={`text-xl font-semibold ${getVerdictColor(result.verdict)}`}>
                        {result.verdict}
                      </div>
                    </div>

                    {/* Detailed Scores */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Source Reliability</span>
                          <span className="font-bold">{result.source_reliability}%</span>
                        </div>
                        <Progress value={result.source_reliability} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Evidence Strength</span>
                          <span className="font-bold">{result.evidence_strength}%</span>
                        </div>
                        <Progress value={result.evidence_strength} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Consistency</span>
                          <span className="font-bold">{result.consistency}%</span>
                        </div>
                        <Progress value={result.consistency} className="h-2" />
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-4 bg-muted rounded-xl">
                      <h3 className="font-semibold mb-2">Analysis Explanation</h3>
                      <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </div>

                    {/* Evidence */}
                    {result.evidence && result.evidence.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Key Evidence</h3>
                        <ul className="space-y-2">
                          {result.evidence.map((item: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar - Stats & Recent */}
            <div className="space-y-6">
              <Card className="p-6 rounded-2xl">
                <h3 className="font-display text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-success/10">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-bold">1,247</div>
                      <div className="text-xs text-muted-foreground">Verified Today</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-destructive/10">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <div className="font-bold">342</div>
                      <div className="text-xs text-muted-foreground">False Claims</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <div className="font-bold">89</div>
                      <div className="text-xs text-muted-foreground">Pending Review</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-2xl">
                <h3 className="font-display text-lg font-bold mb-4">Trending Claims</h3>
                <div className="space-y-3">
                  {[
                    { text: "Climate change statistics 2025", status: "verified" },
                    { text: "Election results update", status: "mixed" },
                    { text: "New health study findings", status: "pending" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-xl">
                      <div className="text-sm font-medium mb-1">{item.text}</div>
                      <div className="text-xs text-muted-foreground capitalize">{item.status}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;