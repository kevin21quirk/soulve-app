# SouLVE Local Development Setup Script
# This script helps set up local Supabase development environment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SouLVE Local Development Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop from:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Docker:" -ForegroundColor Yellow
    Write-Host "1. Start Docker Desktop" -ForegroundColor White
    Write-Host "2. Wait for it to fully start" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    exit 1
}

# Check if Supabase CLI is installed
Write-Host ""
try {
    $supabaseVersion = supabase --version
    Write-Host "✓ Supabase CLI is installed: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Supabase CLI is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Supabase CLI installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Supabase CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Starting Local Supabase..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "- Start PostgreSQL on localhost:54322" -ForegroundColor White
Write-Host "- Start Supabase Studio on http://localhost:54323" -ForegroundColor White
Write-Host "- Apply all database migrations" -ForegroundColor White
Write-Host "- Set up Auth, Storage, and Edge Functions" -ForegroundColor White
Write-Host ""
Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
Write-Host ""

# Start Supabase
supabase start

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "✓ Supabase Started Successfully!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    
    # Get status
    Write-Host "Local Supabase Connection Details:" -ForegroundColor Cyan
    Write-Host ""
    supabase status
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Copy .env.local.example to .env.local" -ForegroundColor Yellow
    Write-Host "   Copy-Item .env.local.example .env.local" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Update .env.local with the credentials shown above" -ForegroundColor Yellow
    Write-Host "   - Copy the 'anon key' to VITE_SUPABASE_PUBLISHABLE_KEY" -ForegroundColor White
    Write-Host "   - API URL should be: http://localhost:54321" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Start the development server" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Access Supabase Studio at:" -ForegroundColor Yellow
    Write-Host "   http://localhost:54323" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "Happy coding! 🚀" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    
} else {
    Write-Host ""
    Write-Host "✗ Failed to start Supabase" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Docker Desktop is not running" -ForegroundColor White
    Write-Host "- Ports 54321-54323 are already in use" -ForegroundColor White
    Write-Host "- Insufficient Docker resources" -ForegroundColor White
    Write-Host ""
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
