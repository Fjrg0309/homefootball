# Prueba rápida de la jornada 38 con temporada 2024

Write-Host "=== PRUEBA JORNADA 38 TEMPORADA 2024 ===" -ForegroundColor Cyan
Write-Host ""

$league = 140
$season = 2024

# Probar con el endpoint de última jornada
Write-Host "Obteniendo ultima jornada de La Liga temporada $season..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/football/fixtures/latest-round?league=$league&season=$season" -TimeoutSec 15
    
    Write-Host "   OK Partidos obtenidos: $($response.results)" -ForegroundColor Green
    Write-Host ""
    
    if ($response.response -and $response.response.Count -gt 0) {
        Write-Host "   PARTIDOS DE LA JORNADA:" -ForegroundColor Cyan
        Write-Host "   ======================" -ForegroundColor Cyan
        Write-Host ""
        
        foreach ($match in $response.response) {
            $homeTeam = $match.teams.home.name
            $awayTeam = $match.teams.away.name
            $scoreHome = if ($null -ne $match.goals.home) { $match.goals.home } else { "-" }
            $scoreAway = if ($null -ne $match.goals.away) { $match.goals.away } else { "-" }
            $status = $match.fixture.status.short
            $date = $match.fixture.date
            
            Write-Host "   $homeTeam  $scoreHome - $scoreAway  $awayTeam" -ForegroundColor White
            Write-Host "      Estado: $status | Fecha: $date" -ForegroundColor Gray
            Write-Host ""
        }
    }
    else {
        Write-Host "   No hay partidos disponibles" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
