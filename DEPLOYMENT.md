# Deployment Guide for Truth Weaver

This guide covers deploying the Truth Weaver application to Vercel.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- Vercel CLI installed: `npm install -g vercel`
- API Keys:
  - **GROQ_API_KEY** (Required) - Get from [Groq Console](https://console.groq.com/)
  - **NEWSDATA_API_KEY** (Optional) - Get from [NewsData.io](https://newsdata.io/)

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy the Application

From the project root directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- What's your project's name? **truth-weaver** (or your preferred name)
- In which directory is your code located? **./** (press Enter)

### 4. Configure Environment Variables

After deployment, you need to add environment variables:

#### Via Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GROQ_API_KEY` | Your Groq API key | Production, Preview, Development |
| `NEWSDATA_API_KEY` | Your NewsData API key (optional) | Production, Preview, Development |

#### Via Vercel CLI:

```bash
# Add GROQ_API_KEY
vercel env add GROQ_API_KEY

# Add NEWSDATA_API_KEY (optional)
vercel env add NEWSDATA_API_KEY
```

When prompted:
- Select environment: **Production, Preview, and Development**
- Enter the value: Paste your API key

### 5. Redeploy with Environment Variables

After adding environment variables, redeploy:

```bash
vercel --prod
```

## Verifying Deployment

### Test API Endpoints

Once deployed, test your API endpoints:

```bash
# Replace YOUR_DOMAIN with your actual Vercel domain
curl https://YOUR_DOMAIN.vercel.app/api/

# Should return: {"status": "CruxAI System Online"}
```

Test other endpoints:

```bash
# Agent status
curl https://YOUR_DOMAIN.vercel.app/api/agents

# Crisis detection
curl https://YOUR_DOMAIN.vercel.app/api/crisis
```

### Test Frontend

1. Visit your deployed URL: `https://YOUR_DOMAIN.vercel.app`
2. Navigate to different pages:
   - **Crisis Alerts** - Should display crisis data
   - **Agent Monitor** - Should show agent status
   - **Credibility Scoring** - Should allow claim verification
3. Check browser console for any errors

## Troubleshooting

### APIs Not Working

**Problem**: APIs return 500 errors or no data

**Solutions**:
1. Check environment variables are set correctly in Vercel dashboard
2. Check Vercel function logs: `vercel logs YOUR_DOMAIN.vercel.app`
3. Verify API keys are valid and have not expired
4. Check that all dependencies are installed (see `requirements.txt`)

### Import Errors

**Problem**: `ModuleNotFoundError` in Vercel logs

**Solutions**:
1. Ensure `requirements.txt` has correct package names
2. Verify `duckduckgo-search` (not `ddgs`) is in requirements
3. Check that all dependencies have version constraints

### CORS Errors

**Problem**: Frontend can't access API due to CORS

**Solutions**:
1. The backend is configured with `allow_origins=["*"]` for development
2. For production, update `backend_fastapi/main.py` to specify your domain:
   ```python
   allow_origins=["https://your-domain.vercel.app"]
   ```

### Environment Variables Not Loading

**Problem**: APIs work locally but not on Vercel

**Solutions**:
1. Verify environment variables are added to **all environments** (Production, Preview, Development)
2. Redeploy after adding environment variables
3. Check variable names match exactly (case-sensitive)

## Local Development

To run the application locally:

### Backend Only

```bash
cd backend_fastapi
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Only

```bash
npm install
npm run dev
```

### Both Together

```bash
npm run dev:all
```

## Production Considerations

### Security

1. **Restrict CORS**: Update `allow_origins` in `backend_fastapi/main.py` to only allow your domain
2. **API Rate Limiting**: Consider adding rate limiting to prevent abuse
3. **Environment Variables**: Never commit `.env` files to git

### Performance

1. **Caching**: Consider implementing caching for frequently accessed data
2. **Database**: For production, replace in-memory storage with a proper database
3. **CDN**: Vercel automatically provides CDN for static assets

### Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider integrating Sentry or similar service
3. **Logs**: Regularly check Vercel function logs for errors

## Getting API Keys

### Groq API Key (Required)

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and save the key securely

### NewsData API Key (Optional)

1. Visit [NewsData.io](https://newsdata.io/)
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key
5. Note: Free tier has limited requests per day

## Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Review this deployment guide
- Check the main [README.md](./README.md) for project documentation
