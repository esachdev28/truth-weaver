#!/bin/bash

# Verification script for Truth Weaver deployment fixes
# This script tests that all fixes are in place

echo "=== Truth Weaver Deployment Verification ==="
echo ""

# Check 1: Verify requirements.txt has correct package name
echo "✓ Checking requirements.txt..."
if grep -q "duckduckgo-search" requirements.txt; then
    echo "  ✓ duckduckgo-search package name is correct"
else
    echo "  ✗ ERROR: duckduckgo-search not found in requirements.txt"
    exit 1
fi

# Check 2: Verify api/index.py exists
echo "✓ Checking Vercel serverless handler..."
if [ -f "api/index.py" ]; then
    echo "  ✓ api/index.py exists"
else
    echo "  ✗ ERROR: api/index.py not found"
    exit 1
fi

# Check 3: Verify vercel.json configuration
echo "✓ Checking vercel.json..."
if grep -q "@vercel/python" vercel.json; then
    echo "  ✓ vercel.json has correct Python configuration"
else
    echo "  ✗ ERROR: vercel.json missing @vercel/python"
    exit 1
fi

# Check 4: Verify DEPLOYMENT.md exists
echo "✓ Checking deployment documentation..."
if [ -f "DEPLOYMENT.md" ]; then
    echo "  ✓ DEPLOYMENT.md exists"
else
    echo "  ✗ ERROR: DEPLOYMENT.md not found"
    exit 1
fi

# Check 5: Verify backend structure
echo "✓ Checking backend structure..."
if [ -f "backend_fastapi/main.py" ] && [ -f "backend_fastapi/agents.py" ] && [ -f "backend_fastapi/models.py" ]; then
    echo "  ✓ All backend files present"
else
    echo "  ✗ ERROR: Missing backend files"
    exit 1
fi

echo ""
echo "=== All Checks Passed! ==="
echo ""
echo "Next Steps:"
echo "1. Set up environment variables (see DEPLOYMENT.md)"
echo "2. Deploy to Vercel: vercel"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Redeploy: vercel --prod"
echo ""
