"""
Vercel Serverless Function Handler for FastAPI
This file serves as the entry point for Vercel's Python runtime.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Import the FastAPI app
from backend_fastapi.main import app

# Vercel's Python runtime supports ASGI apps directly
# No need for Mangum wrapper
app = app
