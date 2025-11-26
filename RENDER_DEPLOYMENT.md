# Render Backend Deployment Guide

This guide will walk you through deploying your FastAPI backend to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your GitHub repository pushed with the latest code
- API keys ready: GROQ_API_KEY, NEWSDATA_API_KEY, HUGGINGFACE_API_KEY (optional)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist

Your repository should have these files in the root directory:

- ✅ `requirements.txt` - Python dependencies
- ✅ `start_backend.py` - Backend startup script
- ✅ `backend_fastapi/` - Your FastAPI application directory

### 1.2 Verify `.gitignore`

Make sure your `.gitignore` includes:

```
.env
.env.local
backend_fastapi/.env
venv/
__pycache__/
```

### 1.3 Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 2: Create a Web Service on Render

### 2.1 Sign In to Render

1. Go to [https://render.com](https://render.com)
2. Sign in or create a new account
3. Click **"New +"** → **"Web Service"**

### 2.2 Connect Your Repository

1. Click **"Connect a repository"**
2. Authorize Render to access your GitHub account
3. Select your `truth-weaver` repository

### 2.3 Configure the Web Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `truth-weaver-backend` (or your preferred name) |
| **Region** | Choose closest to your users (e.g., Oregon, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | Leave blank (or `.` if needed) |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python start_backend.py` |
| **Instance Type** | `Free` (or upgrade as needed) |

---

## Step 3: Configure Environment Variables

In the Render dashboard for your service:

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add each of the following:

| Key | Value | Notes |
|-----|-------|-------|
| `GROQ_API_KEY` | `your_groq_api_key` | Required for AI verification |
| `NEWSDATA_API_KEY` | `your_newsdata_api_key` | Required for news scanning |
| `HUGGINGFACE_API_KEY` | `your_huggingface_api_key` | Optional for enhanced chat |
| `PYTHON_VERSION` | `3.11.0` | Specify Python version |
| `PORT` | `8000` | FastAPI default port |

> [!IMPORTANT]
> Replace the placeholder values with your actual API keys. Never commit these to Git!

---

## Step 4: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Start your backend with `python start_backend.py`
3. Wait for the deployment to complete (usually 2-5 minutes)

---

## Step 5: Verify Deployment

### 5.1 Check Service URL

Once deployed, Render will provide a URL like:
```
https://truth-weaver-backend.onrender.com
```

### 5.2 Test Health Endpoint

Open your browser or use curl:

```bash
curl https://truth-weaver-backend.onrender.com/
```

Expected response:
```json
{"status": "CruxAI System Online"}
```

### 5.3 Test API Endpoints

```bash
# Test agents status
curl https://truth-weaver-backend.onrender.com/api/agents

# Test news endpoint
curl https://truth-weaver-backend.onrender.com/api/news/technology
```

---

## Step 6: Update Frontend Configuration

### 6.1 Update `.env.local`

Update your frontend environment variables:

```bash
# Backend URL - Update this to your Render URL
VITE_API_URL=https://truth-weaver-backend.onrender.com

# Keep your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### 6.2 Update CORS Settings (if needed)

If you want to restrict CORS to specific domains, edit `backend_fastapi/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://your-frontend-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then commit and push to trigger a new deployment.

---

## Step 7: Monitor Your Deployment

### 7.1 View Logs

In the Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Monitor for errors or issues

### 7.2 Check Metrics

- Click **"Metrics"** to see CPU, memory usage
- Free tier has limitations (512 MB RAM, spins down after inactivity)

---

## Troubleshooting

### Issue: Service Won't Start

**Check logs for:**
- Missing dependencies → Update `requirements.txt`
- Port binding issues → Ensure `start_backend.py` uses `0.0.0.0`
- Import errors → Verify all files are committed

### Issue: API Calls Failing

**Verify:**
- Environment variables are set correctly
- API keys are valid
- CORS settings allow your frontend domain

### Issue: Service Spins Down (Free Tier)

**Solutions:**
- Upgrade to paid tier for always-on service
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your service every 5 minutes
- Accept 30-second cold start on first request

### Issue: Build Fails

**Common fixes:**
```bash
# Ensure Python version is specified
PYTHON_VERSION=3.11.0

# Check requirements.txt has no syntax errors
# Verify all dependencies are available on PyPI
```

---

## Advanced Configuration

### Custom Domain

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed
4. Render provides free SSL certificates

### Auto-Deploy on Push

Render automatically deploys when you push to your connected branch. To disable:
1. Go to **Settings**
2. Toggle **"Auto-Deploy"** off

### Health Check Endpoint

Render uses your root endpoint `/` for health checks. You can customize:

1. Go to **Settings** → **Health Check Path**
2. Set to `/` (already configured in your `main.py`)

---

## Cost Optimization

### Free Tier Limits
- 750 hours/month of runtime
- Service spins down after 15 minutes of inactivity
- 512 MB RAM

### Upgrade Options
- **Starter ($7/month)**: Always-on, 512 MB RAM
- **Standard ($25/month)**: 2 GB RAM, better performance

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend `VITE_API_URL` to Render URL
3. ✅ Deploy frontend to Vercel (if not already done)
4. ✅ Test end-to-end functionality
5. ✅ Set up monitoring and alerts

---

## Quick Reference

### Render Service Commands

```bash
# View logs
render logs -s truth-weaver-backend

# Restart service
render restart -s truth-weaver-backend

# Deploy manually
render deploy -s truth-weaver-backend
```

### Environment Variables Checklist

- [ ] `GROQ_API_KEY`
- [ ] `NEWSDATA_API_KEY`
- [ ] `HUGGINGFACE_API_KEY` (optional)
- [ ] `PYTHON_VERSION`
- [ ] `PORT`

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)

---

**Your backend will be live at:** `https://truth-weaver-backend.onrender.com`

Good luck with your deployment! 🚀
