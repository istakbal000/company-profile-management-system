# Vercel Deployment Fix Script for Windows
Write-Host "🚀 Starting Vercel deployment fix process..." -ForegroundColor Green

# Step 1: Test frontend build locally
Write-Host "📦 Testing frontend build..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed. Please fix build errors before deploying." -ForegroundColor Red
    exit 1
}

# Step 2: Test backend
Write-Host "🔧 Testing backend..." -ForegroundColor Yellow
Set-Location ..\backend
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Backend dependency installation failed." -ForegroundColor Red
    exit 1
}

# Step 3: Commit and push changes
Write-Host "📝 Committing deployment fixes..." -ForegroundColor Yellow
Set-Location ..
git add .
git commit -m "fix: Update Vercel configuration to fix 404 errors

- Fix static file routing in vercel.json
- Update Vite config for proper base path
- Add explicit build configuration
- Improve SPA routing support"

git push origin main

Write-Host "🎉 Deployment fixes applied and pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel dashboard and redeploy your project"
Write-Host "2. Set up environment variables (see DEPLOYMENT_FIX.md)"
Write-Host "3. Verify deployment at your Vercel URL"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_FIX.md" -ForegroundColor Blue