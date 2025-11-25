#!/bin/bash

# Truth Weaver - Quick Deployment Script
# This script helps you deploy to Vercel step by step

echo "🚀 Truth Weaver Deployment Helper"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "📦 Step 1: Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "📝 Step 2: Committing changes to Git..."
git add .
git commit -m "Prepare for deployment with authentication system"

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel (for preview deployment)"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Run: vercel --prod (for production deployment)"
echo ""
echo "📖 See deployment_checklist.md for detailed instructions"
