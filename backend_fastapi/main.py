from fastapi import FastAPI, BackgroundTasks, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
from models import (
    Claim, Evidence, ScoreResponse, CrisisResponse, 
    ExplainRequest, ExplainResponse, ScanRequest, VerifyRequest, ScoreRequest
)
from agents import ScanAgent, VerifyAgent, ScoreAgent, ExplainAgent, CrisisAgent

app = FastAPI(title="Crux-AI Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
scan_agent = ScanAgent()
verify_agent = VerifyAgent()
score_agent = ScoreAgent()
explain_agent = ExplainAgent()
crisis_agent = CrisisAgent()

# In-memory storage for demo purposes
processed_claims: List[Claim] = []

@app.get("/")
def health_check():
    return {"status": "CruxAI System Online"}

@app.get("/api/claims", response_model=List[Claim])
def get_claims():
    return processed_claims

@app.post("/api/verify")
async def verify_claim(
    text: str = Form(None),
    link: str = Form(None),
    image: UploadFile = File(None)
):
    # Handle cases where only link or image is provided
    claim_text = text or ""
    
    # Create a new claim object
    claim = Claim(
        id=str(uuid.uuid4()),
        text=claim_text,
        status="processing"
    )
    
    # 1. Verify (pass link and image if available)
    # We need to read image content if present
    image_content = await image.read() if image else None
    
    claim = verify_agent.verify(claim, link=link, image_content=image_content)
    
    # 2. Score
    score = score_agent.score(claim)
    claim.score = score
    
    # 3. Update status
    if score.verdict == "VERIFIED":
        claim.status = "verified"
    else:
        claim.status = "unverified"
        
    processed_claims.append(claim)
    
    return {
        "claim": claim,
        "score": score
    }

@app.post("/api/score", response_model=ScoreResponse)
def score_claim(request: ScoreRequest):
    # Construct a temporary claim object for scoring
    claim = Claim(
        text=request.claim_text,
        evidence=request.evidence
    )
    return score_agent.score(claim)

@app.post("/api/explain", response_model=ExplainResponse)
def explain_verdict(request: ExplainRequest):
    explanation = explain_agent.explain(request.claim_text, request.verdict, request.lang)
    return ExplainResponse(explanation=explanation)

@app.get("/api/crisis", response_model=CrisisResponse)
def check_crisis():
    claims_to_check = processed_claims
    # If no claims have been processed locally, fetch fresh news to check for crises
    if not claims_to_check:
        print("No local claims found. Scanning for breaking news...")
        claims_to_check = scan_agent.scan()
        
    return crisis_agent.detect_crisis(claims_to_check)

def background_scan(source_url: str):
    new_claims = scan_agent.scan(source_url)
    for claim in new_claims:
        claim.id = str(uuid.uuid4())
        # Optional: Auto-verify scanned claims?
        # For now, just add them
        processed_claims.append(claim)

@app.post("/api/scan")
def trigger_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(background_scan, request.source_url)
    return {"message": f"Scan initiated for {request.source_url}"}

@app.get("/api/agents")
def get_agents_status():
    try:
        # Calculate stats based on processed_claims
        total_processed = len(processed_claims)
        
        return {
            "agents": [
                {
                    "name": "ScanAgent",
                    "status": "active",
                    "processed": total_processed * 2 + 120, # Mock logic for demo
                    "active": 1,
                    "description": "Monitors social media and news sources for emerging claims",
                    "progress": 95,
                },
                {
                    "name": "VerifyAgent",
                    "status": "active",
                    "processed": total_processed,
                    "active": 0,
                    "description": "Cross-references claims with trusted fact-checking sources",
                    "progress": 100,
                },
                {
                    "name": "ScoreAgent",
                    "status": "active",
                    "processed": total_processed,
                    "active": 0,
                    "description": "Calculates credibility scores based on evidence strength",
                    "progress": 100,
                },
                {
                    "name": "ExplainAgent",
                    "status": "idle",
                    "processed": total_processed // 2,
                    "active": 0,
                    "description": "Generates human-readable explanations and translations",
                    "progress": 0,
                },
            ],
            "activity_logs": [
                {"time": "Just now", "agent": "System", "action": "System health check passed", "status": "success"},
                {"time": "1 min ago", "agent": "ScanAgent", "action": "Scanned for crisis events", "status": "success"},
            ]
        }
    except Exception as e:
        print(f"Error in get_agents_status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/forensics")
def analyze_media(
    url: str = Form(None),
    file: UploadFile = File(None)
):
    # Mock forensic analysis
    import random
    score = random.randint(10, 90)
    
    return {
        "defakeScore": score,
        "manipulations": [
            "Potential face manipulation detected" if score > 50 else "No significant manipulation detected",
            "Compression artifacts analyzed"
        ],
        "provenance": "Source origin analysis completed.",
        "recommendation": "HIGH RISK" if score > 60 else ("MODERATE RISK" if score > 30 else "LIKELY AUTHENTIC")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
