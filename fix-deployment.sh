#!/bin/bash

# Vercel Deployment Fix Script
echo "🚀 Starting Vercel deployment fix process..."

# Step 1: Test frontend build locally
echo "📦 Testing frontend build..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed. Please fix build errors before deploying."
    exit 1
fi

# Step 2: Test backend
echo "🔧 Testing backend..."
cd ../backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Backend dependency installation failed."
    exit 1
fi

# Step 3: Commit and push changes
echo "📝 Committing deployment fixes..."
cd ..
git add .
git commit -m "fix: Update Vercel configuration to fix 404 errors

- Fix static file routing in vercel.json
- Update Vite config for proper base path
- Add explicit build configuration
- Improve SPA routing support"

git push origin main

echo "🎉 Deployment fixes applied and pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Vercel dashboard and redeploy your project"
echo "2. Set up environment variables (see DEPLOYMENT_FIX.md)"
echo "3. Verify deployment at your Vercel URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_FIX.md"