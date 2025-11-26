"""
Simplified Vercel handler for FastAPI
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Create a simple FastAPI app
app = FastAPI(title="CruxAI API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
async def root():
    return {"status": "CruxAI System Online", "version": "1.0"}

@app.get("/api/agents")
async def get_agents():
    return {
        "agents": [
            {"name": "ScanAgent", "status": "active"},
            {"name": "VerifyAgent", "status": "active"},
            {"name": "ScoreAgent", "status": "active"}
        ]
    }

@app.get("/api/news/categories")
async def get_categories():
    return {
        "categories": ["politics", "technology", "health", "business"]
    }

# Wrap with Mangum for Vercel
handler = Mangum(app, lifespan="off")
