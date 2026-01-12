# Script para ejecutar el backend con logs visibles
Write-Host "=== Deteniendo procesos Java existentes ===" -ForegroundColor Yellow
Stop-Process -Name java -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "=== Navegando al directorio backend ===" -ForegroundColor Yellow
Set-Location -Path "C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend"

Write-Host "=== Compilando el proyecto ===" -ForegroundColor Yellow
mvn clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: La compilación falló" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "=== Iniciando el backend con perfil local ===" -ForegroundColor Green
Write-Host "Los logs aparecerán a continuación..." -ForegroundColor Cyan
Write-Host ""

# Usar comillas para el parámetro -D en PowerShell
java "-Dspring.profiles.active=local" -jar target\homefootball-0.0.1-SNAPSHOT.jar
