#!/bin/bash

# Vercel Deployment Helper Script
# This script helps prepare and deploy your HireNext application to Vercel

set -e

echo "🚀 HireNext Vercel Deployment Helper"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check if git repo is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Please commit your changes before deploying"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for required files
echo "✅ Checking required files..."
required_files=("vercel.json" "frontend/package.json" "backend/package.json" "backend/vercel-app.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    else
        echo "   ✓ $file"
    fi
done

# Check frontend build
echo ""
echo "🔨 Testing frontend build..."
cd frontend
if npm run build; then
    echo "   ✅ Frontend build successful"
else
    echo "   ❌ Frontend build failed"
    exit 1
fi
cd ..

# Check backend dependencies
echo ""
echo "📦 Checking backend dependencies..."
cd backend
if npm install --production; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend dependency installation failed"
    exit 1
fi
cd ..

echo ""
echo "🌟 Pre-deployment checks completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Ensure you have set up your production database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Import your GitHub repository to Vercel"
echo "4. Use the following build configuration:"
echo ""
echo "   Build Command: cd frontend && npm run build"
echo "   Output Directory: frontend/dist"
echo "   Install Command: cd frontend && npm install && cd ../backend && npm install"
echo ""
echo "📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""

read -p "Open Vercel deployment guide? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    if command -v code &> /dev/null; then
        code VERCEL_DEPLOYMENT_GUIDE.md
    elif command -v open &> /dev/null; then
        open VERCEL_DEPLOYMENT_GUIDE.md
    elif command -v xdg-open &> /dev/null; then
        xdg-open VERCEL_DEPLOYMENT_GUIDE.md
    else
        echo "📖 Please open VERCEL_DEPLOYMENT_GUIDE.md manually"
    fi
fi

echo ""
echo "🎉 Ready for Vercel deployment!"
echo "Visit https://vercel.com/new to deploy your project."