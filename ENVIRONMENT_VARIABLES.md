# Environment Variables Reference

Complete list of all environment variables needed for the Truth Weaver application.

---

## 🔧 For Render (Backend Deployment)

Add these in the Render dashboard under **Environment Variables**:

### Required Variables

```bash
# AI & LLM API Key (Required for verification, scoring, chat)
GROQ_API_KEY=your_groq_api_key_here

# News Data API Key (Required for news scanning)
NEWSDATA_API_KEY=your_newsdata_api_key_here

# Python Version (Recommended)
PYTHON_VERSION=3.11.0

# Port Configuration (Optional - Render sets this automatically)
PORT=8000
```

### Optional Variables

```bash
# Hugging Face API Key (Optional - for enhanced image analysis and chat)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

---

## 🌐 For Vercel (Frontend Deployment)

Add these in the Vercel dashboard under **Settings → Environment Variables**:

### Required Variables

```bash
# Supabase Configuration (Required for authentication)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Backend API URL (Update after Render deployment)
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## 💻 For Local Development

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Backend API Keys
GROQ_API_KEY=your_groq_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Local Backend URL
VITE_API_URL=http://localhost:8000
```

Also create `backend_fastapi/.env`:

```bash
# Backend API Keys
GROQ_API_KEY=your_groq_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

---

## 📋 How to Get API Keys

### 1. GROQ_API_KEY (Required)

**Free Tier Available** ✅

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)

**Usage**: AI-powered claim verification, scoring, and chat functionality

---

### 2. NEWSDATA_API_KEY (Required)

**Free Tier Available** ✅ (200 requests/day)

1. Go to [https://newsdata.io](https://newsdata.io)
2. Sign up for a free account
3. Navigate to **Dashboard → API Key**
4. Copy your API key

**Usage**: Real-time news scanning and crisis detection

---

### 3. HUGGINGFACE_API_KEY (Optional)

**Free Tier Available** ✅

1. Go to [https://huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Go to **Settings → Access Tokens**
4. Click **New Token**
5. Select **Read** permissions
6. Copy the token (starts with `hf_...`)

**Usage**: Enhanced image analysis for AI-generated content detection

---

### 4. Supabase Configuration (Required for Frontend)

**Free Tier Available** ✅

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

**Usage**: User authentication and database

---

## 🔒 Security Best Practices

### ✅ DO:
- Store API keys in environment variables
- Use different keys for development and production
- Add `.env` and `.env.local` to `.gitignore`
- Rotate keys periodically
- Use Render/Vercel's built-in secret management

### ❌ DON'T:
- Commit API keys to Git
- Share keys in public channels
- Use production keys in development
- Hard-code keys in source files

---

## 📝 Quick Copy-Paste Templates

### For Render Dashboard

```
GROQ_API_KEY=
NEWSDATA_API_KEY=
HUGGINGFACE_API_KEY=
PYTHON_VERSION=3.11.0
PORT=8000
```

### For Vercel Dashboard

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_URL=
```

### For Local `.env.local`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
GROQ_API_KEY=
NEWSDATA_API_KEY=
HUGGINGFACE_API_KEY=
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing Your Configuration

### Test Backend Locally

```bash
# Ensure .env files are set up
cd backend_fastapi
python verify_backend.py
```

### Test Frontend Locally

```bash
# Ensure .env.local is set up
npm run dev:all
```

### Test After Deployment

```bash
# Test Render backend
curl https://your-backend.onrender.com/

# Test Vercel frontend
curl https://your-frontend.vercel.app/
```

---

## 🆘 Troubleshooting

### "API Key not found" errors

1. Check environment variables are set correctly
2. Restart the service after adding variables
3. Verify no typos in variable names
4. Check API key is valid and not expired

### CORS errors

1. Update `VITE_API_URL` to match your Render backend URL
2. Ensure Render backend is running
3. Check CORS settings in `backend_fastapi/main.py`

### Authentication errors

1. Verify Supabase credentials are correct
2. Check Supabase project is active
3. Ensure `VITE_SUPABASE_URL` includes `https://`

---

## 📊 Environment Variables Summary

| Variable | Required | Where | Purpose |
|----------|----------|-------|---------|
| `GROQ_API_KEY` | ✅ Yes | Render + Local | AI verification & chat |
| `NEWSDATA_API_KEY` | ✅ Yes | Render + Local | News scanning |
| `HUGGINGFACE_API_KEY` | ⚠️ Optional | Render + Local | Image analysis |
| `VITE_SUPABASE_URL` | ✅ Yes | Vercel + Local | Authentication |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ Yes | Vercel + Local | Authentication |
| `VITE_API_URL` | ✅ Yes | Vercel + Local | Backend connection |
| `PYTHON_VERSION` | ⚠️ Optional | Render | Python runtime |
| `PORT` | ⚠️ Optional | Render | Server port |

---

**Last Updated**: 2025-11-26

Need help getting any of these keys? Let me know which one you need assistance with!
