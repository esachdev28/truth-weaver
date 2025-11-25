#!/usr/bin/env python3
"""
Startup script for the backend API server.
This script ensures the backend_fastapi directory is in the Python path.
"""
import sys
import os

# Add the backend_fastapi directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend_fastapi')
sys.path.insert(0, backend_dir)

# Now import and run uvicorn
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[backend_dir]
    )
