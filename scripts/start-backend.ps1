# Start Backend (Flask API)
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  MentorAid Backend - Starting Flask API  " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "`n Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host " Virtual environment created!" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`n Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install/upgrade dependencies
Write-Host "`n Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Check if model exists
if (-Not (Test-Path "..\ml-models\trained_models\random_forest_model.pkl")) {
    Write-Host "`n Model not found! Training model..." -ForegroundColor Yellow
    Set-Location -Path "..\ml-models"
    python train_final_model.py
    Set-Location -Path "..\backend"
    Write-Host " Model trained successfully!" -ForegroundColor Green
}

# Start Flask server
Write-Host "`n" -NoNewline
Write-Host "===========================================" -ForegroundColor Green
Write-Host "  Backend API Running on http://localhost:5000" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "`n Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

python app.py
