# 🚀 Complete Deployment Guide for Truth Weaver

This guide covers deploying your Truth Weaver application to Vercel with full authentication and backend support.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ **Vercel Account** - [Sign up here](https://vercel.com/signup)
- ✅ **Supabase Project** - [Create project](https://supabase.com/dashboard)
- ✅ **API Keys**:
  - **GROQ_API_KEY** (Required) - [Get from Groq Console](https://console.groq.com/)
  - **NEWSDATA_API_KEY** (Optional) - [Get from NewsData.io](https://newsdata.io/)
  - **HUGGINGFACE_API_KEY** (Optional) - [Get from Hugging Face](https://huggingface.co/settings/tokens)

---

## 🔧 Step 1: Configure Supabase

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: truth-weaver (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click **"Create new project"**

### 1.2 Enable Email Authentication

1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable it (should be enabled by default)
4. Configure email templates (optional but recommended):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

### 1.3 Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

### 2.3 Deploy Your Application

From your project root:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (for first deployment)
- **Project name?** → truth-weaver
- **Directory?** → `./` (press Enter)

### 2.4 Configure Environment Variables

After deployment, add environment variables via Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **truth-weaver** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key | Production, Preview, Development |
| `GROQ_API_KEY` | Your Groq API key | Production, Preview, Development |
| `NEWSDATA_API_KEY` | Your NewsData API key (optional) | Production, Preview, Development |
| `HUGGINGFACE_API_KEY` | Your Hugging Face token (optional) | Production, Preview, Development |

**Important**: Select **all three environments** (Production, Preview, Development) for each variable.

### 2.5 Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

---

## ✅ Step 3: Verify Deployment

### 3.1 Test Frontend

1. Visit your deployed URL: `https://your-project.vercel.app`
2. Navigate through pages:
   - ✅ Home page loads
   - ✅ Agent Monitor shows data
   - ✅ Crisis Alerts displays
   - ✅ Credibility Scoring works

### 3.2 Test Authentication

1. Click **"Sign In"** in the header
2. Click **"Create Account"**
3. Sign up with your email
4. Check your email for confirmation (if enabled)
5. Log in with your credentials
6. Verify:
   - ✅ User avatar appears in header
   - ✅ Dropdown shows your email
   - ✅ Logout works correctly

### 3.3 Test Backend API

Test your API endpoints:

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

---

## 🔍 Troubleshooting

### Authentication Not Working

**Problem**: Can't sign up or login

**Solutions**:
1. Verify Supabase environment variables are set correctly in Vercel
2. Check Supabase project is active and email auth is enabled
3. Look at browser console for errors
4. Check Vercel function logs: `vercel logs`

### Backend API Errors

**Problem**: API returns 500 errors or no data

**Solutions**:
1. Check environment variables in Vercel dashboard
2. View Vercel function logs: `vercel logs YOUR_DOMAIN.vercel.app`
3. Verify API keys are valid
4. Check that `requirements.txt` has all dependencies

### Build Failures

**Problem**: Vercel build fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Python dependencies in `requirements.txt`
4. Check for TypeScript errors locally: `npm run build`

### CORS Errors

**Problem**: Frontend can't access backend API

**Solutions**:
1. Backend is configured with `allow_origins=["*"]` for development
2. For production security, update `backend_fastapi/main.py`:
   ```python
   allow_origins=["https://your-domain.vercel.app"]
   ```

---

## 🔐 Security Best Practices

### For Production

1. **Restrict CORS**: Update `allow_origins` in `backend_fastapi/main.py` to only your domain
2. **Enable RLS**: Set up Row Level Security in Supabase for data protection
3. **Email Verification**: Enable email confirmation in Supabase settings
4. **Rate Limiting**: Consider adding rate limiting to API endpoints
5. **Environment Variables**: Never commit `.env` files to git

### Supabase Security

1. Go to **Authentication** → **Settings**
2. Enable **"Enable email confirmations"**
3. Set **"Site URL"** to your Vercel domain
4. Add your domain to **"Redirect URLs"**

---

## 📊 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to your project in Vercel Dashboard
2. Click **Analytics** tab
3. Enable analytics for your project

### Monitor Logs

View real-time logs:

```bash
vercel logs --follow
```

View logs for specific deployment:

```bash
vercel logs YOUR_DOMAIN.vercel.app
```

---

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Go to Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update Supabase redirect URLs

2. **Email Templates**:
   - Customize Supabase email templates
   - Add your branding and styling

3. **Social Auth** (Optional):
   - Enable Google/GitHub auth in Supabase
   - Add social login buttons to Login page

4. **Database Setup** (Optional):
   - Create Supabase tables for storing claims
   - Replace in-memory storage with database

---

## 📝 Local Development

To run locally with the same setup:

### 1. Create `.env.local` file

```bash
cp .env.example .env.local
```

### 2. Add your credentials

Edit `.env.local` with your actual values.

### 3. Run the application

```bash
npm run dev:all
```

This starts both frontend (port 5173) and backend (port 8000).

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Vercel Logs**: `vercel logs`
2. **Check Browser Console**: Look for JavaScript errors
3. **Check Supabase Logs**: Go to Supabase Dashboard → Logs
4. **Review this guide**: Ensure all steps were followed
5. **Check GitHub Issues**: Search for similar problems

---

## 🎉 Success!

Your Truth Weaver application is now deployed with:
- ✅ Full authentication system
- ✅ Working backend API
- ✅ Crisis detection
- ✅ Credibility scoring
- ✅ Media forensics
- ✅ Real-time chat

**Your app is live at**: `https://your-project.vercel.app`

Enjoy fighting misinformation! 🛡️
