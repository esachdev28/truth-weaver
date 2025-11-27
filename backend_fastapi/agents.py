import os
import json
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from groq import Groq
from models import Claim, Evidence, ScoreResponse, CrisisAlert, CrisisResponse
import requests
from bs4 import BeautifulSoup

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWSDATA_API_KEY = os.getenv("NEWSDATA_API_KEY")

class ScanAgent:
    def __init__(self):
        self.api_key = NEWSDATA_API_KEY
        if not self.api_key:
            print("WARNING: NEWSDATA_API_KEY not set. Using mock data for news scanning.")
        
        # Map frontend categories to NewsData API categories
        self.category_mapping = {
            "general-news": "top",
            "politics": "politics",
            "health": "health",
            "crisis": "world",
            "finance": "business",
            "tech-ai": "technology",
            "science": "science",
            "crime": "crime",
            "international": "world",
            "social": "entertainment"
        }

    def scan_by_category(self, category: str) -> List[Claim]:
        """Scan news by category"""
        claims = []
        
        # Map frontend category to NewsData category
        api_category = self.category_mapping.get(category, "top")
        
        if self.api_key:
            try:
                from newsdataapi import NewsDataApiClient
                api = NewsDataApiClient(apikey=self.api_key)
                print(f"Fetching {category} news (API category: {api_category})...")
                
                # Fetch news for specific category
                response = api.news_api(category=api_category, language="en")
                
                if response and 'results' in response:
                    seen_titles = set()
                    for article in response['results']:
                        title = article.get('title', 'No title')
                        if title not in seen_titles:
                            seen_titles.add(title)
                            claims.append(Claim(
                                text=title,
                                source=article.get('source_id', 'newsdata'),
                                status="unverified",
                                evidence=[Evidence(
                                    source=article.get('source_id', 'newsdata'),
                                    content=article.get('description', '') or title,
                                    url=article.get('link', '')
                                )]
                            ))
                    print(f"Successfully fetched {len(claims)} articles for {category}")
                else:
                    print(f"No results from NewsData API for {category}")
            except ImportError as e:
                print(f"ERROR: Failed to import newsdataapi: {e}")
            except Exception as e:
                print(f"ERROR: Failed to fetch {category} news: {e}")
        else:
            print(f"Using mock data for {category} (no NEWSDATA_API_KEY)")
        
        if not claims:
            # Fallback mock data
            claims = self._get_mock_news_by_category(category)
        
        return claims
    
    def _get_mock_news_by_category(self, category: str) -> List[Claim]:
        """Generate mock news for a category"""
        mock_data = {
            "general-news": "Breaking: Major developments in global affairs.",
            "politics": "Election results show surprising turnout.",
            "health": "New health guidelines announced by WHO.",
            "crisis": "Emergency response teams deployed to affected areas.",
            "finance": "Stock markets show mixed signals amid economic uncertainty.",
            "tech-ai": "AI breakthrough announced by leading tech company.",
            "science": "Scientists discover new insights into climate patterns.",
            "crime": "Law enforcement reports decrease in crime rates.",
            "international": "International summit addresses global challenges.",
            "social": "Viral social media trend sparks global conversation."
        }
        
        return [Claim(
            text=mock_data.get(category, "Latest news update."),
            source="mock_data",
            status="unverified"
        )]

    def scan(self, source_url: Optional[str] = None) -> List[Claim]:
        claims = []
        if self.api_key:
            try:
                from newsdataapi import NewsDataApiClient
                api = NewsDataApiClient(apikey=self.api_key)
                print(f"Scanning news with NewsData API...")
                # Fetch latest news about crisis topics
                response = api.news_api(q="crisis OR war OR disaster OR emergency OR earthquake OR attack", language="en", country="us")
                
                if response and 'results' in response:
                    seen_titles = set()
                    for article in response['results']:
                        title = article.get('title', 'No title')
                        if title not in seen_titles:
                            seen_titles.add(title)
                            claims.append(Claim(
                                text=title,
                                source=article.get('source_id', 'newsdata'),
                                status="unverified",
                                evidence=[Evidence(
                                    source=article.get('source_id', 'newsdata'),
                                    content=article.get('description', '') or title,
                                    url=article.get('link', '')
                                )]
                            ))
                    print(f"Successfully scanned {len(claims)} news articles")
                else:
                    print("No results from NewsData API")
            except ImportError as e:
                print(f"ERROR: Failed to import newsdataapi: {e}")
            except Exception as e:
                print(f"ERROR: Failed to scan news: {e}")
        else:
            print("Using mock data (no NEWSDATA_API_KEY)")
        
        if not claims:
            # Fallback mock data if API fails or returns nothing
            print("Returning mock crisis data")
            claims.append(Claim(
                text="Breaking: Major earthquake reported in Japan.",
                source="social_media_mock",
                status="unverified"
            ))
        return claims

class VerifyAgent:
    def verify(self, claim: Claim, link: Optional[str] = None, image_content: Optional[bytes] = None) -> Claim:
        print(f"Verifying claim: {claim.text}")
        
        # Process Link
        if link:
            try:
                import requests
                from bs4 import BeautifulSoup
                print(f"Fetching content from link: {link}")
                response = requests.get(link, timeout=10)
                response.raise_for_status()
                soup = BeautifulSoup(response.content, 'html.parser')
                title = soup.title.string if soup.title else link
                text_content = soup.get_text()[:1000] # Limit content
                
                claim.evidence.append(Evidence(
                    source=f"User Link: {title}",
                    content=f"Extracted content: {text_content}...",
                    url=link
                ))
                
                # If claim text is empty, use the link title/content
                if not claim.text:
                    claim.text = f"Check content from {link}"
                print(f"Successfully extracted content from link")
                    
            except requests.exceptions.RequestException as e:
                print(f"ERROR: Failed to fetch link {link}: {e}")
                claim.evidence.append(Evidence(
                    source="User Link",
                    content=f"Failed to fetch content from {link}: {str(e)}",
                    url=link
                ))
            except Exception as e:
                print(f"ERROR: Unexpected error processing link: {e}")
                claim.evidence.append(Evidence(
                    source="User Link",
                    content=f"Error processing link: {str(e)}",
                    url=link
                ))

        # Process Image (Placeholder for now)
        if image_content:
            print(f"Received image upload ({len(image_content)} bytes)")
            claim.evidence.append(Evidence(
                source="User Image",
                content="Image received. (Vision analysis not yet implemented)",
                url="Uploaded Image"
            ))
            if not claim.text:
                claim.text = "Verify uploaded image content"

        # Perform Search Verification
        if claim.text:
            try:
                # Improve search query to get fact-checking results
                search_queries = [
                    f"{claim.text} fact check",
                    f"{claim.text} snopes",
                    f"{claim.text} verified"
                ]
                
                print(f"Searching for fact-checking evidence: {claim.text}")
                with DDGS() as ddgs:
                    # Try multiple search strategies
                    all_results = []
                    for query in search_queries[:2]:  # Use first 2 queries
                        try:
                            results = list(ddgs.text(query, max_results=2))
                            all_results.extend(results)
                            if len(all_results) >= 3:
                                break
                        except:
                            continue
                    
                    # Remove duplicates and limit to 3 results
                    seen_urls = set()
                    unique_results = []
                    for r in all_results:
                        url = r.get('href', '')
                        if url and url not in seen_urls:
                            seen_urls.add(url)
                            unique_results.append(r)
                            if len(unique_results) >= 3:
                                break
                    
                    for r in unique_results:
                        claim.evidence.append(Evidence(
                            source=r.get('title', 'Unknown'),
                            content=r.get('body', ''),
                            url=r.get('href', '')
                        ))
                    print(f"Found {len(unique_results)} fact-checking results")
            except Exception as e:
                print(f"ERROR: DuckDuckGo search failed: {e}")
                claim.evidence.append(Evidence(
                    source="Search Error",
                    content=f"Failed to perform web search: {str(e)}",
                    url=""
                ))
        
        return claim

class ScoreAgent:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
        if not self.client:
            print("WARNING: GROQ_API_KEY not set. Scoring will return UNVERIFIED.")

    def score(self, claim: Claim) -> ScoreResponse:
        if not self.client:
            # Fallback if no API key
            print("ERROR: Cannot score claim - no GROQ_API_KEY configured")
            return ScoreResponse(
                final_score=0,
                source_reliability=0,
                evidence_strength=0,
                consistency=0,
                verdict="UNVERIFIED"
            )

        evidence_text = "\n".join([f"- {e.content} ({e.url})" for e in claim.evidence])
        prompt = f"""
        You are an expert fact-checker. Analyze the following claim based on the evidence provided.
        
        Claim: {claim.text}
        
        Evidence:
        {evidence_text}
        
        Provide a credibility assessment with these scores (0-100):
        
        1. final_score: Overall credibility (0=completely false, 100=completely verified)
           - If claim is FALSE, score should be 0-30
           - If claim is MIXED/UNCERTAIN, score should be 40-60
           - If claim is VERIFIED, score should be 70-100
        
        2. source_reliability: How trustworthy are the sources (0=unreliable, 100=highly reliable)
        
        3. evidence_strength: How strong is the evidence (0=weak/contradictory, 100=strong/conclusive)
        
        4. consistency: How consistent is the evidence (0=contradictory, 100=all agrees)
        
        5. verdict: Must be one of: VERIFIED, FALSE, MIXED, UNVERIFIED
           - VERIFIED: Claim is supported by strong evidence
           - FALSE: Claim is contradicted by evidence
           - MIXED: Evidence is contradictory or unclear
           - UNVERIFIED: Insufficient evidence to determine
        
        IMPORTANT: 
        - If evidence is irrelevant to the claim, mark as UNVERIFIED with low scores
        - final_score should reflect the verdict (FALSE=low, VERIFIED=high)
        - Be consistent: if verdict is FALSE, final_score must be low (0-30)
        
        Return ONLY a JSON object with these exact keys:
        {{"final_score": <number>, "source_reliability": <number>, "evidence_strength": <number>, "consistency": <number>, "verdict": "<string>"}}
        """
        
        try:
            print(f"Scoring claim with Groq AI: {claim.text[:50]}...")
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a fact-checking AI. Output ONLY JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            result = json.loads(chat_completion.choices[0].message.content)
            print(f"Scoring complete: {result.get('verdict', 'UNKNOWN')}")
            return ScoreResponse(**result)
        except json.JSONDecodeError as e:
            print(f"ERROR: Failed to parse Groq response as JSON: {e}")
            return ScoreResponse(
                final_score=0,
                source_reliability=0,
                evidence_strength=0,
                consistency=0,
                verdict="UNVERIFIED"
            )
        except Exception as e:
            print(f"ERROR: Groq API call failed: {e}")
            return ScoreResponse(
                final_score=0,
                source_reliability=0,
                evidence_strength=0,
                consistency=0,
                verdict="UNVERIFIED"
            )

class ExplainAgent:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
        if not self.client:
            print("WARNING: GROQ_API_KEY not set. Explanations will be unavailable.")

    def explain(self, claim_text: str, verdict: str, lang: str = "en") -> str:
        if not self.client:
            print("ERROR: Cannot generate explanation - no GROQ_API_KEY configured")
            return "Explanation unavailable (No GROQ_API_KEY configured)."

        prompt = f"Explain why the claim '{claim_text}' was judged as {verdict}. Language: {lang}. Keep it concise."
        
        try:
            print(f"Generating explanation for verdict: {verdict}")
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
            )
            explanation = chat_completion.choices[0].message.content
            print(f"Explanation generated successfully")
            return explanation
        except Exception as e:
            print(f"ERROR: Failed to generate explanation: {e}")
            return f"Error generating explanation: {str(e)}"

class CrisisAgent:
    def detect_crisis(self, claims: List[Claim]) -> CrisisResponse:
        alerts = []
        keywords = [
            "earthquake", "pandemic", "violence", "tsunami", "terror", "flood", "war", "attack", "assassinated", 
            "airstrike", "conflict", "dead", "killed", "crisis", "warning", "strike", "military", "navy", 
            "russia", "israel", "lebanon", "gaza", "ukraine", "iran", "missile", "bomb", "blast", "explosion", 
            "fire", "wildfire", "storm", "hurricane", "tornado", "typhoon", "cyclone", "weather", "heat", 
            "emergency", "rescue", "police", "arrest", "shoot", "gun", "crime", "murder", "crash", "accident", 
            "disaster", "danger", "threat", "alert", "breaking"
        ]
        
        for claim in claims:
            detected_keywords = [k for k in keywords if k in claim.text.lower()]
            if detected_keywords:
                alerts.append(CrisisAlert(
                    id=str(hash(claim.text)),
                    title="Potential Crisis Detected",
                    severity="HIGH", # Simplified logic
                    region="Unknown", # Would need NER for this
                    verified=claim.status == "verified",
                    keywords=detected_keywords,
                    description=claim.text
                ))
        
        return CrisisResponse(
            crisis_detected=len(alerts) > 0,
            alerts=alerts,
            recommended_actions=["Monitor situation", "Verify sources"] if alerts else []
        )
