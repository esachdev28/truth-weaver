"""
Simple test endpoint to verify Vercel Python runtime is working
"""
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "status": "success",
            "message": "Python runtime is working!",
            "path": self.path
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
