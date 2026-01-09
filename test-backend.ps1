# Script para probar el backend

Write-Host "=== PRUEBAS DEL BACKEND ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "1. Verificando salud del backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/health" -TimeoutSec 5
    Write-Host "   OK Backend funcionando" -ForegroundColor Green
    Write-Host "   Respuesta: $($health | ConvertTo-Json -Compress)" -ForegroundColor Gray
}
catch {
    Write-Host "   ERROR Backend NO responde: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Asegurate de iniciar el backend con: cd backend; mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: API Football Status
Write-Host "2. Verificando configuracion de API Football..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "http://localhost:8080/api/football/status" -TimeoutSec 5
    if ($status.configured) {
        Write-Host "   OK API Football configurada correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "   ERROR API Football NO configurada: $($status.message)" -ForegroundColor Red
    }
    Write-Host "   Respuesta: $($status | ConvertTo-Json -Compress)" -ForegroundColor Gray
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Debug Config
Write-Host "3. Verificando configuracion debug..." -ForegroundColor Yellow
try {
    $debug = Invoke-RestMethod -Uri "http://localhost:8080/debug/config" -TimeoutSec 5
    Write-Host "   OK Configuracion obtenida" -ForegroundColor Green
    Write-Host "   API Key configurada: $($debug.apiKeyConfigured)" -ForegroundColor Gray
    Write-Host "   Base URL: $($debug.baseUrl)" -ForegroundColor Gray
    Write-Host "   Database URL: $($debug.databaseUrl)" -ForegroundColor Gray
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Peticion simple a API Football
Write-Host "4. Probando peticion a API Football (ping)..." -ForegroundColor Yellow
try {
    $ping = Invoke-RestMethod -Uri "http://localhost:8080/api/football/ping" -TimeoutSec 5
    Write-Host "   OK Ping exitoso" -ForegroundColor Green
    Write-Host "   Respuesta: $($ping | ConvertTo-Json -Compress)" -ForegroundColor Gray
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Peticion real a API Football - La Liga
Write-Host "5. Probando peticion real: Informacion de La Liga..." -ForegroundColor Yellow
try {
    $headers = @{
        "Accept" = "application/json"
    }
    $laliga = Invoke-RestMethod -Uri "http://localhost:8080/api/football/leagues/140" -Headers $headers -TimeoutSec 10
    Write-Host "   OK Datos de La Liga obtenidos" -ForegroundColor Green
    Write-Host "   Resultados: $($laliga.results)" -ForegroundColor Gray
    if ($laliga.response -and $laliga.response.Count -gt 0) {
        Write-Host "   Liga: $($laliga.response[0].league.name)" -ForegroundColor Gray
        Write-Host "   Pais: $($laliga.response[0].country.name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 6: Peticion de partidos por jornada
Write-Host "6. Probando peticion: Partidos de La Liga Jornada 38..." -ForegroundColor Yellow
try {
    $headers = @{
        "Accept" = "application/json"
    }
    $league = 140
    $season = 2023
    $round = [uri]::EscapeDataString("Regular Season - 38")
    $uri = "http://localhost:8080/api/football/fixtures/round?league={0}&season={1}&round={2}" -f $league, $season, $round
    Write-Host "   URI: $uri" -ForegroundColor Gray
    
    $fixtures = Invoke-RestMethod -Uri $uri -Headers $headers -TimeoutSec 15
    Write-Host "   OK Partidos obtenidos" -ForegroundColor Green
    Write-Host "   Resultados: $($fixtures.results)" -ForegroundColor Gray
    if ($fixtures.response -and $fixtures.response.Count -gt 0) {
        $match = $fixtures.response[0]
        Write-Host "   Primer partido: $($match.teams.home.name) vs $($match.teams.away.name)" -ForegroundColor Gray
        Write-Host "   Fecha: $($match.fixture.date)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Cyan
