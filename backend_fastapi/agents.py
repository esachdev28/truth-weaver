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

    def scan(self, source_url: Optional[str] = None) -> List[Claim]:
        claims = []
        if self.api_key:
            try:
                from newsdataapi import NewsDataApiClient
                api = NewsDataApiClient(apikey=self.api_key)
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
            except Exception as e:
                print(f"Error scanning news: {e}")
        
        if not claims:
            # Fallback mock data if API fails or returns nothing
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
                response = requests.get(link, timeout=10)
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
                    
            except Exception as e:
                print(f"Error fetching link: {e}")
                claim.evidence.append(Evidence(
                    source="User Link",
                    content=f"Failed to fetch content from {link}",
                    url=link
                ))

        # Process Image (Placeholder for now)
        if image_content:
            claim.evidence.append(Evidence(
                source="User Image",
                content="Image received. (Vision analysis not yet implemented)",
                url="Uploaded Image"
            ))
            if not claim.text:
                claim.text = "Verify uploaded image content"

        # Perform Search Verification
        if claim.text:
            with DDGS() as ddgs:
                results = list(ddgs.text(claim.text, max_results=3))
                for r in results:
                    claim.evidence.append(Evidence(
                        source=r.get('title', 'Unknown'),
                        content=r.get('body', ''),
                        url=r.get('href', '')
                    ))
        
        return claim

class ScoreAgent:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

    def score(self, claim: Claim) -> ScoreResponse:
        if not self.client:
            # Fallback if no API key
            return ScoreResponse(
                final_score=0,
                source_reliability=0,
                evidence_strength=0,
                consistency=0,
                verdict="UNVERIFIED"
            )

        evidence_text = "\n".join([f"- {e.content} ({e.url})" for e in claim.evidence])
        prompt = f"""
        Analyze the following claim based on the evidence provided.
        Claim: {claim.text}
        Evidence:
        {evidence_text}
        
        Return a JSON object with the following keys:
        - final_score (0-100)
        - source_reliability (0-100)
        - evidence_strength (0-100)
        - consistency (0-100)
        - verdict (VERIFIED, FALSE, MIXED, UNVERIFIED)
        """
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a fact-checking AI. Output ONLY JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            result = json.loads(chat_completion.choices[0].message.content)
            return ScoreResponse(**result)
        except Exception as e:
            print(f"Error in scoring: {e}")
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

    def explain(self, claim_text: str, verdict: str, lang: str = "en") -> str:
        if not self.client:
            return "Explanation unavailable (No AI Key)."

        prompt = f"Explain why the claim '{claim_text}' was judged as {verdict}. Language: {lang}. Keep it concise."
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating explanation: {e}"

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
