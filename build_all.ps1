# NyaySetu Full Stack Build Script
# This script builds the production backend JAR and the frontend assets.

Write-Host "🚀 Starting Full Stack Build Process..." -ForegroundColor Cyan

# 1. Build Backend
Write-Host "☕ Building Backend (Maven)..." -ForegroundColor Yellow
Set-Location "backend"
.\mvnw clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Set-Location ".."

# 2. Build Frontend
Write-Host "⚛️ Building Frontend (Vite)..." -ForegroundColor Green
Set-Location "frontend"
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Set-Location ".."

Write-Host "✅ Full Stack Build Completed Successfully!" -ForegroundColor Green
Write-Host "📦 Backend Artifact: backend\target\nyaysetu-backend-0.0.1-SNAPSHOT.jar"
Write-Host "📦 Frontend Assets: frontend\dist\"
