# Start Frontend (React + Vite)
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  MentorAid Frontend - Starting React App " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "`n Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host " Dependencies installed!" -ForegroundColor Green
}

# Start Vite dev server
Write-Host "`n" -NoNewline
Write-Host "===========================================" -ForegroundColor Green
Write-Host "  Frontend Running on http://localhost:5173" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "`n Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev
