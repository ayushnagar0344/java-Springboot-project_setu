# NyaySetu Multi-Service Launcher
# Use this script to start both Backend and Frontend for development.

Write-Host "🚀 Starting NyaySetu Platform (Startup Standard)..." -ForegroundColor Cyan

# 1. Start Backend
Write-Host "☕ Launching Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'backend'; .\mvnw spring-boot:run" -WindowStyle Normal

# 2. Start Frontend
Write-Host "⚛️ Launching Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'frontend'; npm run dev" -WindowStyle Normal

Write-Host "✅ Both services are launching in separate windows." -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:3000"
Write-Host "🔗 Backend:  http://localhost:8080"
