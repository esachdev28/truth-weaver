# URLs and APIs Used in Truth Weaver

Complete reference of all external services, APIs, and URLs used in the application.

---

## 🔌 External APIs

### 1. **Groq API** (AI/LLM Service)
- **Purpose**: AI-powered claim verification, scoring, and chat functionality
- **API Endpoint**: `https://api.groq.com/openai/v1/`
- **Model Used**: `llama-3.3-70b-versatile`
- **Authentication**: API Key (`GROQ_API_KEY`)
- **Used In**:
  - `backend_fastapi/agents.py` - ScoreAgent (claim scoring)
  - `backend_fastapi/agents.py` - ExplainAgent (verdict explanations)
  - `backend_fastapi/main.py` - Chat endpoint
- **Free Tier**: ✅ Yes
- **Get API Key**: [https://console.groq.com](https://console.groq.com)

**Example Usage**:
```python
from groq import Groq
client = Groq(api_key=GROQ_API_KEY)
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[...]
)
```

---

### 2. **NewsData API** (News Aggregation)
- **Purpose**: Real-time news scanning and crisis detection
- **API Endpoint**: Via `newsdataapi` Python package
- **Authentication**: API Key (`NEWSDATA_API_KEY`)
- **Used In**:
  - `backend_fastapi/agents.py` - ScanAgent (news scanning)
  - `backend_fastapi/agents.py` - scan_by_category (category-based news)
- **Categories Supported**:
  - `top`, `politics`, `health`, `world`, `business`, `technology`, `science`, `crime`, `entertainment`
- **Free Tier**: ✅ Yes (200 requests/day)
- **Get API Key**: [https://newsdata.io](https://newsdata.io)

**Example Usage**:
```python
from newsdataapi import NewsDataApiClient
api = NewsDataApiClient(apikey=NEWSDATA_API_KEY)
response = api.news_api(category="technology", language="en")
```

---

### 3. **Hugging Face API** (AI Models)
- **Purpose**: Image analysis and AI-generated content detection
- **API Endpoint**: `https://api-inference.huggingface.co/models/`
- **Models Used**:
  - `Salesforce/blip-image-captioning-large` - Image captioning
  - `umm-maybe/AI-image-detector` - AI-generated image detection
- **Authentication**: API Key (`HUGGINGFACE_API_KEY`)
- **Used In**:
  - `backend_fastapi/image_analyzer.py` - ImageAnalyzer class
- **Free Tier**: ✅ Yes
- **Get API Key**: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Example Usage**:
```python
import requests
API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
response = requests.post(API_URL, headers=headers, data=image_bytes)
```

---

### 4. **Supabase** (Authentication & Database)
- **Purpose**: User authentication, database storage
- **API Endpoint**: Your Supabase project URL
- **Authentication**: Project URL + Anon Key
- **Environment Variables**:
  - `VITE_SUPABASE_URL` - Your project URL
  - `VITE_SUPABASE_PUBLISHABLE_KEY` - Anon/public key
- **Used In**:
  - Frontend authentication system
  - User data storage
- **Free Tier**: ✅ Yes
- **Get Credentials**: [https://supabase.com/dashboard](https://supabase.com/dashboard)

**Example Usage**:
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

---

### 5. **DuckDuckGo Search** (Web Search)
- **Purpose**: Web search for claim verification
- **API**: Free, no API key required
- **Library**: `duckduckgo-search` Python package
- **Used In**:
  - `backend_fastapi/agents.py` - VerifyAgent (evidence gathering)
- **Free Tier**: ✅ Yes (completely free)
- **No Registration Required**: ✅

**Example Usage**:
```python
from duckduckgo_search import DDGS
with DDGS() as ddgs:
    results = list(ddgs.text("search query", max_results=3))
```

---

## 🌐 External Service URLs

### Image Verification Services (Referenced)
These are suggested to users for manual verification:

1. **Google Reverse Image Search**
   - URL: `https://images.google.com/`
   - Purpose: Reverse image search
   - Used in: `backend_fastapi/image_analyzer.py` (line 222)

2. **TinEye**
   - URL: `https://tineye.com/`
   - Purpose: Reverse image search
   - Used in: `backend_fastapi/image_analyzer.py` (line 228)

---

## 📡 Internal API Endpoints

Your FastAPI backend exposes these endpoints:

### Health & Status
- `GET /` - Health check
- `GET /api/agents` - Agent status and activity logs

### Claim Verification
- `POST /api/verify` - Verify claim (text/link/image)
- `POST /api/score` - Score a claim
- `POST /api/explain` - Explain verdict

### News & Crisis
- `GET /api/news/{category}` - Get news by category
- `POST /api/scan` - Trigger news scan
- `GET /api/crisis` - Check for crisis alerts
- `GET /api/claims` - Get all processed claims

### Media Analysis
- `POST /api/forensics` - Analyze media for manipulation

### Chat
- `POST /api/chat` - AI chat assistant

---

## 🔗 API Integration Summary

| Service | Type | Auth Required | Cost | Rate Limit |
|---------|------|---------------|------|------------|
| **Groq** | LLM/AI | API Key | Free | Generous |
| **NewsData** | News | API Key | Free | 200/day |
| **Hugging Face** | AI Models | API Key | Free | Rate limited |
| **Supabase** | Auth/DB | URL + Key | Free | 50K users |
| **DuckDuckGo** | Search | None | Free | Unlimited |

---

## 📦 Python Packages Used

From `requirements.txt`:

```
fastapi==0.109.0              # Web framework
uvicorn[standard]==0.27.0     # ASGI server
pydantic==2.5.3               # Data validation
groq==0.4.2                   # Groq API client
duckduckgo-search==4.1.1      # DuckDuckGo search
python-dotenv==1.0.0          # Environment variables
newsdataapi==0.1.14           # NewsData API client
python-multipart==0.0.6       # File upload support
requests==2.31.0              # HTTP requests
beautifulsoup4==4.12.2        # HTML parsing
lxml==5.1.0                   # XML/HTML parser
huggingface-hub>=0.20.0       # Hugging Face API
Pillow>=10.0.0                # Image processing
mangum>=0.17.0                # AWS Lambda adapter
```

---

## 🔐 Required Environment Variables by Service

### Groq API
```bash
GROQ_API_KEY=gsk_...
```

### NewsData API
```bash
NEWSDATA_API_KEY=pub_...
```

### Hugging Face API
```bash
HUGGINGFACE_API_KEY=hf_...
```

### Supabase
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Backend Connection
```bash
VITE_API_URL=http://localhost:8000  # Local
VITE_API_URL=https://your-backend.onrender.com  # Production
```

---

## 🚀 Deployment URLs

### Development
- **Frontend**: `http://localhost:8080`
- **Backend**: `http://localhost:8000`

### Production (After Deployment)
- **Frontend (Vercel)**: `https://your-app.vercel.app`
- **Backend (Render)**: `https://your-backend.onrender.com`

---

## 📊 API Call Flow

```
User Request
    ↓
Frontend (React/Vite)
    ↓
Backend API (FastAPI)
    ↓
┌─────────────────────────────────┐
│ External Services:              │
│ • Groq API (AI scoring)         │
│ • NewsData API (news)           │
│ • DuckDuckGo (search)           │
│ • Hugging Face (image analysis) │
│ • Supabase (auth/db)            │
└─────────────────────────────────┘
    ↓
Response to User
```

---

## 🛠️ Testing API Endpoints

### Test Groq API
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

### Test NewsData API
```bash
curl "https://newsdata.io/api/1/news?apikey=$NEWSDATA_API_KEY&language=en"
```

### Test Your Backend
```bash
# Health check
curl http://localhost:8000/

# Get agents status
curl http://localhost:8000/api/agents

# Get news
curl http://localhost:8000/api/news/technology
```

---

**Last Updated**: 2025-11-26

All APIs listed have free tiers suitable for development and moderate production use.
