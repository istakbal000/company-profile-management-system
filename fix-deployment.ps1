# Vercel Deployment Fix Script for Windows
Write-Host "🚀 Starting Vercel deployment fix process..." -ForegroundColor Green

# Step 1: Update dependencies to resolve warnings
Write-Host "📦 Updating dependencies to resolve deprecation warnings..." -ForegroundColor Yellow

# Update backend dependencies
Set-Location backend
Write-Host "Updating backend dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies updated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Backend dependency update failed." -ForegroundColor Red
    exit 1
}

# Update frontend dependencies
Set-Location .\..\frontend
Write-Host "Updating frontend dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies updated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependency update failed." -ForegroundColor Red
    exit 1
}

# Step 2: Test frontend build locally
Write-Host "📦 Testing frontend build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed. Please fix build errors before deploying." -ForegroundColor Red
    exit 1
}

# Step 3: Commit and push changes
Write-Host "📝 Committing deployment fixes..." -ForegroundColor Yellow
Set-Location ..
git add .
git commit -m "fix: Update dependencies and Vercel configuration

- Fix multer deprecation warning by updating to latest LTS
- Update ESLint to resolve deprecation warning
- Optimize Vite build with chunk splitting to reduce bundle size
- Improve static file routing in vercel.json
- Add proper SPA routing support"

git push origin main

Write-Host "🎉 Deployment fixes applied and pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel dashboard and redeploy your project"
Write-Host "2. Set up environment variables (see DEPLOYMENT_FIX.md)"
Write-Host "3. Verify deployment at your Vercel URL"
Write-Host ""
Write-Host "✨ Improvements made:" -ForegroundColor Magenta
Write-Host "• Fixed multer deprecation warning"
Write-Host "• Updated ESLint to latest version"
Write-Host "• Optimized build chunks to reduce bundle size"
Write-Host "• Improved Vercel configuration for better performance"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_FIX.md" -ForegroundColor Blue