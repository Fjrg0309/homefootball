# Script para iniciar el backend con variables de entorno desde .env

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      INICIANDO BACKEND SPRING BOOT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del backend
Set-Location -Path $PSScriptRoot

# Cargar variables de entorno desde .env
$envFile = "src\main\resources\.env"
if (Test-Path $envFile) {
    Write-Host "Cargando variables de entorno desde .env..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "  $name configurado" -ForegroundColor Gray
        }
    }
    Write-Host "Variables de entorno cargadas correctamente." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "ADVERTENCIA: No se encontro el archivo .env" -ForegroundColor Red
    Write-Host "Crea src\main\resources\.env con tus credenciales" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
java -version 2>&1 | Select-Object -First 1
Write-Host ""

# Limpiar y compilar
Write-Host "Limpiando y compilando..." -ForegroundColor Yellow
mvn clean compile -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: La compilacion ha fallado." -ForegroundColor Red
    Write-Host "Revisa los errores anteriores." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Compilacion exitosa. Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "El servidor estara disponible en: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Endpoints de prueba:" -ForegroundColor Cyan
Write-Host "  - http://localhost:8080/health" -ForegroundColor Gray
Write-Host "  - http://localhost:8080/api/football/status" -ForegroundColor Gray
Write-Host "  - http://localhost:8080/api/football/fixtures/latest-round?league=140&season=2024" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar Spring Boot
mvn spring-boot:run

pause
