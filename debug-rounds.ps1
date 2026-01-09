# Script para debuggear el formato de jornadas

Write-Host "=== DEBUG JORNADAS LA LIGA ===" -ForegroundColor Cyan
Write-Host ""

$league = 140
$season = 2023

# Test 1: Obtener TODOS los partidos de La Liga para ver qué jornadas existen
Write-Host "1. Obteniendo TODOS los partidos de La Liga temporada 2023..." -ForegroundColor Yellow
try {
    $allFixtures = Invoke-RestMethod -Uri "http://localhost:8080/api/football/fixtures?league=$league&season=$season" -TimeoutSec 30
    Write-Host "   Total de partidos: $($allFixtures.results)" -ForegroundColor Green
    
    if ($allFixtures.response -and $allFixtures.response.Count -gt 0) {
        # Obtener todas las jornadas únicas
        $rounds = $allFixtures.response | ForEach-Object { $_.league.round } | Select-Object -Unique | Sort-Object
        Write-Host "   Jornadas encontradas:" -ForegroundColor Cyan
        foreach ($round in $rounds) {
            Write-Host "      - $round" -ForegroundColor Gray
        }
        
        # Mostrar la última jornada
        $lastRound = $rounds | Select-Object -Last 1
        Write-Host ""
        Write-Host "   Ultima jornada: $lastRound" -ForegroundColor Yellow
        
        # Contar partidos por jornada
        Write-Host ""
        Write-Host "   Partidos por jornada:" -ForegroundColor Cyan
        $roundCounts = $allFixtures.response | Group-Object { $_.league.round } | Sort-Object Name
        foreach ($group in $roundCounts | Select-Object -Last 5) {
            Write-Host "      $($group.Name): $($group.Count) partidos" -ForegroundColor Gray
        }
    }
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Probando diferentes formatos de jornada ===" -ForegroundColor Cyan
Write-Host ""

# Test 2: Probar diferentes formatos
$formatsToTry = @(
    "Regular Season - 38",
    "38",
    "Matchday 38",
    "Round 38",
    "Jornada 38"
)

foreach ($format in $formatsToTry) {
    Write-Host "Probando formato: '$format'" -ForegroundColor Yellow
    try {
        $roundEncoded = [uri]::EscapeDataString($format)
        $uri = "http://localhost:8080/api/football/fixtures/round?league=$league&season=$season&round=$roundEncoded"
        $result = Invoke-RestMethod -Uri $uri -TimeoutSec 10
        Write-Host "   Resultados: $($result.results)" -ForegroundColor $(if ($result.results -gt 0) { "Green" } else { "Red" })
        
        if ($result.results -gt 0 -and $result.response.Count -gt 0) {
            $match = $result.response[0]
            Write-Host "   Ejemplo: $($match.teams.home.name) vs $($match.teams.away.name)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host ""
Write-Host "=== Probando endpoint de ultima jornada ===" -ForegroundColor Cyan
Write-Host ""

# Test 3: Probar el endpoint de última jornada
Write-Host "Obteniendo ultima jornada completada..." -ForegroundColor Yellow
try {
    $latestRound = Invoke-RestMethod -Uri "http://localhost:8080/api/football/fixtures/latest-round?league=$league&season=$season" -TimeoutSec 15
    Write-Host "   Resultados: $($latestRound.results)" -ForegroundColor Green
    
    if ($latestRound.response -and $latestRound.response.Count -gt 0) {
        $match = $latestRound.response[0]
        Write-Host "   Jornada: $($match.league.round)" -ForegroundColor Cyan
        Write-Host "   Ejemplo: $($match.teams.home.name) $($match.goals.home) - $($match.goals.away) $($match.teams.away.name)" -ForegroundColor Gray
        Write-Host "   Fecha: $($match.fixture.date)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   Total de partidos en esta jornada: $($latestRound.results)" -ForegroundColor Green
    }
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DEBUG COMPLETADO ===" -ForegroundColor Cyan
