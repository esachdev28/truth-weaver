# Render Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] `requirements.txt` is up to date
- [ ] API keys ready (GROQ, NEWSDATA, HUGGINGFACE)

## Render Setup

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service

## Configuration

- [ ] **Name**: `truth-weaver-backend`
- [ ] **Runtime**: Python 3
- [ ] **Build Command**: `pip install -r requirements.txt`
- [ ] **Start Command**: `python start_backend.py`
- [ ] **Instance Type**: Free

## Environment Variables

Add these in Render dashboard:

- [ ] `GROQ_API_KEY` = `your_actual_key`
- [ ] `NEWSDATA_API_KEY` = `your_actual_key`
- [ ] `HUGGINGFACE_API_KEY` = `your_actual_key` (optional)
- [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] `PORT` = `8000`

## Post-Deployment

- [ ] Service deployed successfully
- [ ] Copy Render URL (e.g., `https://truth-weaver-backend.onrender.com`)
- [ ] Test health endpoint: `curl https://your-url.onrender.com/`
- [ ] Update frontend `.env.local` with `VITE_API_URL=https://your-url.onrender.com`
- [ ] Test frontend → backend connection
- [ ] Monitor logs for errors

## Quick Commands

```bash
# Test backend health
curl https://truth-weaver-backend.onrender.com/

# Test agents endpoint
curl https://truth-weaver-backend.onrender.com/api/agents

# Test news endpoint
curl https://truth-weaver-backend.onrender.com/api/news/technology
```

## Your Render URL

Once deployed, write it here:
```
https://______________________.onrender.com
```

Then update `.env.local`:
```bash
VITE_API_URL=https://______________________.onrender.com
```
