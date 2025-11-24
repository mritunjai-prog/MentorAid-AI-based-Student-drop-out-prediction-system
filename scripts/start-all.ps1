# Start Both Backend and Frontend
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "     MentorAid - Starting Full Stack       " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

Write-Host "`n Starting Backend in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"

Write-Host " Waiting 5 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host " Starting Frontend in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-frontend.ps1"

Write-Host "`n" -NoNewline
Write-Host "===========================================" -ForegroundColor Green
Write-Host "  MentorAid is Running!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "`n Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`n Open http://localhost:5173 in your browser" -ForegroundColor Yellow
Write-Host "`n Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
