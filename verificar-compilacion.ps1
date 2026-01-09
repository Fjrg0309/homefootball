#!/usr/bin/env powershell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO COMPILACION DEL PROYECTO" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java
Write-Host "1. Verificando Java instalado..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host $javaVersion -ForegroundColor Green
} catch {
    Write-Host "ERROR: Java no está instalado o no está en PATH" -ForegroundColor Red
}

Write-Host ""

# Verificar Maven
Write-Host "2. Verificando Maven instalado..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn --version 2>&1 | Select-Object -First 1
    Write-Host $mavenVersion -ForegroundColor Green
} catch {
    Write-Host "ERROR: Maven no está instalado o no está en PATH" -ForegroundColor Red
}

Write-Host ""

# Compilar Backend
Write-Host "3. Compilando Backend..." -ForegroundColor Yellow
Push-Location "C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend"

$compilacionOutput = mvn clean compile 2>&1
$compilacionOutput | Out-String | Write-Host

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend compilado correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error en la compilación del backend" -ForegroundColor Red
    Write-Host "Código de salida: $LASTEXITCODE" -ForegroundColor Red
}

Pop-Location

Write-Host ""

# Verificar configuración de Frontend
Write-Host "4. Verificando configuración del Frontend..." -ForegroundColor Yellow
$configPath = "C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\frontend\src\assets\config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "Config del Frontend:" -ForegroundColor Green
    Write-Host "  API URL: $($config.apiUrl)" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontró config.json" -ForegroundColor Red
}

Write-Host ""

# Verificar configuración de Backend
Write-Host "5. Verificando configuración de la Base de Datos..." -ForegroundColor Yellow
$appPropsPath = "C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend\src\main\resources\application.properties"
if (Test-Path $appPropsPath) {
    $lines = Get-Content $appPropsPath | Select-String -Pattern "datasource|port|jpa"
    Write-Host "Configuración del Backend:" -ForegroundColor Green
    $lines | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }
} else {
    Write-Host "ERROR: No se encontró application.properties" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "VERIFICACION COMPLETADA" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
