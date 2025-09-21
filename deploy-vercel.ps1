# Vercel Deployment Helper Script for Windows PowerShell
# This script helps prepare and deploy your HireNext application to Vercel

Write-Host "🚀 HireNext Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "vercel.json")) {
    Write-Host "❌ Error: vercel.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host ""

# Check for uncommitted changes
$gitStatus = git status --porcelain 2>$null
if ($gitStatus) {
    Write-Host "⚠️  Warning: You have uncommitted changes" -ForegroundColor Yellow
    Write-Host "   Please commit your changes before deploying" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/N)"
    if ($continue -notmatch "^[Yy]$") {
        exit 1
    }
}

# Check for required files
Write-Host "✅ Checking required files..." -ForegroundColor Green
$requiredFiles = @("vercel.json", "frontend/package.json", "backend/package.json", "backend/vercel-app.js")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing required file: $file" -ForegroundColor Red
        exit 1
    }
}

# Check frontend build
Write-Host ""
Write-Host "🔨 Testing frontend build..." -ForegroundColor Yellow
Set-Location "frontend"
$buildResult = npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend build failed" -ForegroundColor Red
    Set-Location ".."
    exit 1
}
Set-Location ".."

# Check backend dependencies
Write-Host ""
Write-Host "📦 Checking backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
$installResult = npm install --production
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend dependency installation failed" -ForegroundColor Red
    Set-Location ".."
    exit 1
}
Set-Location ".."

Write-Host ""
Write-Host "🌟 Pre-deployment checks completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure you have set up your production database"
Write-Host "2. Configure environment variables in Vercel dashboard"
Write-Host "3. Import your GitHub repository to Vercel"
Write-Host "4. Use the following build configuration:"
Write-Host ""
Write-Host "   Build Command: cd frontend && npm run build" -ForegroundColor White
Write-Host "   Output Directory: frontend/dist" -ForegroundColor White
Write-Host "   Install Command: cd frontend && npm install && cd ../backend && npm install" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

$openGuide = Read-Host "Open Vercel deployment guide? (Y/n)"
if ($openGuide -notmatch "^[Nn]$") {
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code VERCEL_DEPLOYMENT_GUIDE.md
    } elseif (Get-Command notepad -ErrorAction SilentlyContinue) {
        notepad VERCEL_DEPLOYMENT_GUIDE.md
    } else {
        Write-Host "📖 Please open VERCEL_DEPLOYMENT_GUIDE.md manually" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Ready for Vercel deployment!" -ForegroundColor Green
Write-Host "Visit https://vercel.com/new to deploy your project." -ForegroundColor Cyan

# Keep the window open
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")