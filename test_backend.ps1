# Script para probar el backend de PulmoCheck

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Probando Backend de PulmoCheck" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "https://pulmocheck.onrender.com/api/health" -Method GET
Write-Host "✓ Health Check OK: $($health.status)" -ForegroundColor Green
Write-Host ""

# Test 2: Create Assessment
Write-Host "Test 2: Crear Assessment..." -ForegroundColor Yellow

$body = @{
    patient_name = "Test Patient"
    patient_email = "test@test.com"
    age = 65
    gender = "Masculino"
    years_smoking = 30
    cigarettes_per_day = 20
    family_history = $true
    persistent_cough = $true
    dyspnea = $false
    hemoptysis = $false
    last_ct = "Nunca"
    asbestos_exposure = $false
    copd_emphysema = $true
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = "https://pulmocheck-96f8f.web.app"
    }
    
    $response = Invoke-RestMethod -Uri "https://pulmocheck.onrender.com/api/assessment" -Method POST -Body $body -Headers $headers
    
    Write-Host "✓ Assessment creado exitosamente!" -ForegroundColor Green
    Write-Host "  ID: $($response.assessment_id)" -ForegroundColor White
    Write-Host "  Score: $($response.risk_score)" -ForegroundColor White
    Write-Host "  Nivel: $($response.risk_level)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "✗ Error al crear assessment:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles del error:" -ForegroundColor Yellow
    $_.Exception | Format-List -Force
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Prueba completada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

