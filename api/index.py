"""
Vercel Serverless Function Handler for FastAPI
This file serves as the entry point for Vercel's Python runtime.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend_fastapi.main import app

# Vercel expects a variable named 'app' or 'handler'
# For ASGI apps like FastAPI, we can use the app directly
handler = app
