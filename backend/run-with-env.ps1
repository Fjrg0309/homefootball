# Script para cargar variables de entorno y ejecutar Spring Boot
# Uso: .\run-with-env.ps1

Write-Host "🔧 Cargando variables de entorno desde src/main/resources/.env..." -ForegroundColor Cyan

# Verificar que existe .env
$envPath = "src/main/resources/.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ ERROR: No se encontró el archivo $envPath" -ForegroundColor Red
    Write-Host "📋 Copia .env.example a src/main/resources/.env y configura tus credenciales:" -ForegroundColor Yellow
    Write-Host "   cp .env.example src/main/resources/.env" -ForegroundColor Yellow
    exit 1
}

# Cargar variables desde .env
Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    
    # Ignorar líneas vacías y comentarios
    if ($line -and -not $line.StartsWith('#')) {
        if ($line -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remover comillas si existen
            $value = $value -replace '^["'']|["'']$', ''
            
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "✓ $key configurada" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "🚀 Iniciando Spring Boot..." -ForegroundColor Cyan
Write-Host ""

# Ejecutar Maven
mvn spring-boot:run
