Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INICIANDO BACKEND - API FOOTBALL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar al directorio backend
Set-Location backend

# Cargar variables de entorno desde .env
$envFile = "src\main\resources\.env"
if (Test-Path $envFile) {
    Write-Host "Cargando variables de entorno desde $envFile..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
            Write-Host "  ✓ $name cargada" -ForegroundColor Green
        }
    }
    Write-Host ""
} else {
    Write-Host "[ERROR] No se encontró el archivo $envFile" -ForegroundColor Red
    Write-Host "Por favor crea un archivo .env con las variables necesarias" -ForegroundColor Red
    pause
    exit 1
}

# Verificar variables críticas
Write-Host "Verificando variables..." -ForegroundColor Yellow
if (-not $env:DB_URL) {
    Write-Host "[ERROR] Variable DB_URL no definida" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  ✓ DB_URL configurada" -ForegroundColor Green
Write-Host "  ✓ DB_USERNAME: $env:DB_USERNAME" -ForegroundColor Green
Write-Host "  ✓ API_FOOTBALL_KEY configurada" -ForegroundColor Green
Write-Host "  ✓ SERVER_PORT: $env:SERVER_PORT" -ForegroundColor Green
Write-Host ""

Write-Host "Compilando y ejecutando con Maven..." -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""
& mvn spring-boot:run

pause
