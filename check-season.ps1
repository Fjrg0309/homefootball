# Verificar qué temporada tiene datos

Write-Host "=== VERIFICANDO TEMPORADAS ===" -ForegroundColor Cyan
Write-Host ""

$league = 140

Write-Host "Probando temporada 2024..." -ForegroundColor Yellow
try {
    $r2024 = Invoke-RestMethod "http://localhost:8080/api/football/fixtures/latest-round?league=$league&season=2024" -TimeoutSec 10
    Write-Host "  Resultados 2024: $($r2024.results)" -ForegroundColor $(if ($r2024.results -gt 0) { "Green" } else { "Red" })
}
catch {
    Write-Host "  Error 2024: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

Write-Host "Probando temporada 2023..." -ForegroundColor Yellow
try {
    $r2023 = Invoke-RestMethod "http://localhost:8080/api/football/fixtures/latest-round?league=$league&season=2023" -TimeoutSec 10
    Write-Host "  Resultados 2023: $($r2023.results)" -ForegroundColor $(if ($r2023.results -gt 0) { "Green" } else { "Red" })
    if ($r2023.results -gt 0) {
        $match = $r2023.response[0]
        Write-Host "  Primer partido: $($match.teams.home.name) vs $($match.teams.away.name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "  Error 2023: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== FIN ===" -ForegroundColor Cyan
