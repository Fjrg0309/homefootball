package com.example.information.web;

import com.example.information.model.apifootball.*;
import com.example.information.service.CachedFootballApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * Controller para exponer los endpoints de API-Football
 * Actúa como proxy entre el frontend y la API externa.
 * 
 * Usa CachedFootballApiService que implementa caché persistente en BD:
 * 1. Primero busca en la base de datos
 * 2. Si no encuentra, llama a la API y guarda el resultado
 * 3. Reduce drásticamente el consumo de peticiones API (límite 100/día)
 */
@RestController
@RequestMapping("/api/football")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ApiFootballController {

    private final CachedFootballApiService cachedApiService;

    /**
     * Endpoint de prueba simple (sin dependencias)
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        log.info("=== PING RECIBIDO ===");
        Map<String, Object> response = Map.of(
            "status", "ok",
            "timestamp", System.currentTimeMillis(),
            "message", "Backend funcionando correctamente"
        );
        log.info("Respuesta ping: {}", response);
        return ResponseEntity.ok(response);
    }

    /**
     * Verificar estado de la configuración
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        log.info("=== STATUS RECIBIDO ===");
        try {
            boolean configured = cachedApiService.isConfigured();
            Map<String, Object> response = Map.of(
                "configured", configured,
                "message", configured ? "API-Football está configurado correctamente" : "Falta configurar la API key",
                "backendRunning", true,
                "timestamp", System.currentTimeMillis()
            );
            log.info("Estado configuración: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verificando estado:", e);
            return ResponseEntity.ok(Map.of(
                "configured", false,
                "message", "Error: " + e.getMessage(),
                "error", e.getClass().getName()
            ));
        }
    }

    // ==================== LIGAS ====================

    /**
     * Obtener todas las ligas
     */
    @GetMapping("/leagues")
    public ResponseEntity<LeagueResponse> getLeagues() {
        log.info("GET /api/football/leagues");
        return ResponseEntity.ok(cachedApiService.getLeagues());
    }

    /**
     * Obtener ligas por país
     */
    @GetMapping("/leagues/country/{country}")
    public ResponseEntity<LeagueResponse> getLeaguesByCountry(@PathVariable String country) {
        log.info("GET /api/football/leagues/country/{}", country);
        return ResponseEntity.ok(cachedApiService.getLeaguesByCountry(country));
    }

    /**
     * Obtener liga por ID
     */
    @GetMapping("/leagues/{id}")
    public ResponseEntity<LeagueResponse> getLeagueById(@PathVariable int id) {
        log.info("GET /api/football/leagues/{}", id);
        return ResponseEntity.ok(cachedApiService.getLeagueById(id));
    }

    /**
     * Obtener ligas de un equipo
     */
    @GetMapping("/leagues/team/{teamId}")
    public ResponseEntity<LeagueResponse> getLeaguesByTeam(
            @PathVariable int teamId,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/leagues/team/{}?season={}", teamId, season);
        return ResponseEntity.ok(cachedApiService.getLeaguesByTeam(teamId, season));
    }

    // ==================== EQUIPOS ====================

    /**
     * Obtener equipos de una liga
     */
    @GetMapping("/teams")
    public ResponseEntity<TeamResponse> getTeamsByLeague(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/teams?league={}&season={}", league, season);
        return ResponseEntity.ok(cachedApiService.getTeamsByLeague(league, season));
    }

    /**
     * Obtener equipo por ID
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable int id) {
        log.info("GET /api/football/teams/{}", id);
        return ResponseEntity.ok(cachedApiService.getTeamById(id));
    }

    /**
     * Buscar equipos por nombre
     * La API externa requiere mínimo 3 caracteres
     */
    @GetMapping("/teams/search")
    public ResponseEntity<?> searchTeams(@RequestParam String name) {
        log.info("GET /api/football/teams/search?name={}", name);
        
        // Validar longitud mínima (la API requiere mínimo 3 caracteres)
        if (name == null || name.trim().length() < 3) {
            log.warn("Búsqueda de equipos rechazada: nombre muy corto ({})", name);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "El término de búsqueda debe tener al menos 3 caracteres",
                "response", new Object[0]
            ));
        }
        
        return ResponseEntity.ok(cachedApiService.searchTeams(name.trim()));
    }

    // ==================== JUGADORES ====================

    /**
     * Obtener la plantilla oficial del primer equipo (NO incluye filiales)
     * Usa el endpoint /players/squads que solo devuelve jugadores con ficha del primer equipo
     */
    @GetMapping("/squads/{teamId}")
    public ResponseEntity<SquadResponse> getTeamSquad(@PathVariable int teamId) {
        log.info("GET /api/football/squads/{}", teamId);
        return ResponseEntity.ok(cachedApiService.getTeamSquad(teamId));
    }

    /**
     * Obtener jugadores de un equipo
     */
    @GetMapping("/players")
    public ResponseEntity<PlayerResponse> getPlayersByTeam(
            @RequestParam int team,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/players?team={}&season={}", team, season);
        return ResponseEntity.ok(cachedApiService.getPlayersByTeam(team, season));
    }

    /**
     * Obtener jugador por ID
     */
    @GetMapping("/players/{id}")
    public ResponseEntity<PlayerResponse> getPlayerById(
            @PathVariable int id,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/players/{}?season={}", id, season);
        return ResponseEntity.ok(cachedApiService.getPlayerById(id, season));
    }

    /**
     * Buscar jugadores por nombre
     * La API externa requiere mínimo 4 caracteres
     */
    @GetMapping("/players/search")
    public ResponseEntity<?> searchPlayers(
            @RequestParam String name,
            @RequestParam int league,
            @RequestParam(required = false) Integer season) {
        
        // Calcular temporada actual si no se proporciona
        int currentSeason = season != null ? season : getCurrentSeason();
        
        log.info("GET /api/football/players/search?name={}&league={}&season={}", name, league, currentSeason);
        
        // Validar longitud mínima (la API requiere mínimo 4 caracteres)
        if (name == null || name.trim().length() < 4) {
            log.warn("Búsqueda de jugadores rechazada: nombre muy corto ({})", name);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "El término de búsqueda debe tener al menos 4 caracteres",
                "response", new Object[0]
            ));
        }
        
        return ResponseEntity.ok(cachedApiService.searchPlayers(name.trim(), league, currentSeason));
    }

    /**
     * Obtener máximos goleadores de una liga
     */
    @GetMapping("/players/topscorers")
    public ResponseEntity<PlayerResponse> getTopScorers(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/players/topscorers?league={}&season={}", league, season);
        return ResponseEntity.ok(cachedApiService.getTopScorers(league, season));
    }

    // ==================== PARTIDOS ====================

    /**
     * Obtener partidos de una liga
     */
    @GetMapping("/fixtures")
    public ResponseEntity<FixtureResponse> getFixturesByLeague(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/fixtures?league={}&season={}", league, season);
        return ResponseEntity.ok(cachedApiService.getFixturesByLeague(league, season));
    }

    /**
     * Obtener partidos en vivo
     */
    @GetMapping("/fixtures/live")
    public ResponseEntity<FixtureResponse> getLiveFixtures() {
        log.info("GET /api/football/fixtures/live");
        return ResponseEntity.ok(cachedApiService.getLiveFixtures());
    }

    /**
     * Obtener partidos por fecha
     */
    @GetMapping("/fixtures/date/{date}")
    public ResponseEntity<FixtureResponse> getFixturesByDate(@PathVariable String date) {
        log.info("GET /api/football/fixtures/date/{}", date);
        return ResponseEntity.ok(cachedApiService.getFixturesByDate(date));
    }

    /**
     * Obtener partidos de un equipo
     */
    @GetMapping("/fixtures/team/{teamId}")
    public ResponseEntity<FixtureResponse> getFixturesByTeam(
            @PathVariable int teamId,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/fixtures/team/{}?season={}", teamId, season);
        return ResponseEntity.ok(cachedApiService.getFixturesByTeam(teamId, season));
    }

    /**
     * Obtener la última jornada completada de una liga
     * Devuelve los partidos más recientes finalizados
     */
    @GetMapping("/fixtures/latest-round")
    public ResponseEntity<FixtureResponse> getLatestRound(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/fixtures/latest-round?league={}&season={}", league, season);
        return ResponseEntity.ok(cachedApiService.getLatestRound(league, season));
    }

    /**
     * Obtener partidos de una jornada específica
     */
    @GetMapping("/fixtures/round")
    public ResponseEntity<FixtureResponse> getFixturesByRound(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season,
            @RequestParam String round) {
        log.info("GET /api/football/fixtures/round?league={}&season={}&round={}", league, season, round);
        return ResponseEntity.ok(cachedApiService.getFixturesByRound(league, season, round));
    }

    /**
     * Obtener la última fecha con datos disponibles para una liga
     */
    @GetMapping("/fixtures/latest-date")
    public ResponseEntity<Map<String, String>> getLatestAvailableDate(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/fixtures/latest-date?league={}&season={}", league, season);
        String latestDate = cachedApiService.getLatestAvailableDate(league, season);
        return ResponseEntity.ok(Map.of("date", latestDate));
    }

    // ==================== CLASIFICACIÓN ====================

    /**
     * Obtener clasificación de una liga
     */
    @GetMapping("/standings")
    public ResponseEntity<StandingsResponse> getStandings(
            @RequestParam int league,
            @RequestParam(defaultValue = "2024") int season) {
        log.info("GET /api/football/standings?league={}&season={}", league, season);
        return ResponseEntity.ok(cachedApiService.getStandings(league, season));
    }

    // ==================== DETALLE DE PARTIDO ====================

    /**
     * Obtener un partido por su ID
     */
    @GetMapping("/fixture/{id}")
    public ResponseEntity<FixtureResponse> getFixtureById(@PathVariable int id) {
        log.info("GET /api/football/fixture/{}", id);
        return ResponseEntity.ok(cachedApiService.getFixtureById(id));
    }

    /**
     * Obtener eventos de un partido (goles, tarjetas, sustituciones, etc.)
     */
    @GetMapping("/fixture/{id}/events")
    public ResponseEntity<FixtureEventsResponse> getFixtureEvents(@PathVariable int id) {
        log.info("GET /api/football/fixture/{}/events", id);
        return ResponseEntity.ok(cachedApiService.getFixtureEvents(id));
    }

    /**
     * Obtener estadísticas de un partido
     */
    @GetMapping("/fixture/{id}/statistics")
    public ResponseEntity<FixtureStatisticsResponse> getFixtureStatistics(@PathVariable int id) {
        log.info("GET /api/football/fixture/{}/statistics", id);
        return ResponseEntity.ok(cachedApiService.getFixtureStatistics(id));
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Calcula la temporada actual de fútbol
     * Las temporadas van de agosto a mayo, así que:
     * - Enero a Julio = año anterior (ej: enero 2026 = temporada 2025)
     * - Agosto a Diciembre = año actual (ej: septiembre 2025 = temporada 2025)
     */
    private int getCurrentSeason() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue(); // 1-12
        int year = now.getYear();
        return month < 8 ? year - 1 : year;
    }

    // ==================== ESTADÍSTICAS DE CACHÉ ====================

    /**
     * Obtener estadísticas de la caché persistente en BD
     */
    @GetMapping("/cache/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        log.info("GET /api/football/cache/stats");
        var stats = cachedApiService.getCacheStats();
        return ResponseEntity.ok(Map.of(
            "leagues", stats.leagues(),
            "teams", stats.teams(),
            "players", stats.players(),
            "standings", stats.standings(),
            "squads", stats.squads(),
            "total", stats.leagues() + stats.teams() + stats.players() + stats.standings() + stats.squads(),
            "message", "Datos cacheados en base de datos (persistentes)"
        ));
    }

    /**
     * Forzar actualización de ligas desde la API (ignora caché)
     * Útil para actualizar datos cuando cambien en la API
     */
    @PostMapping("/cache/refresh/leagues")
    public ResponseEntity<Map<String, Object>> refreshLeagues() {
        log.info("POST /api/football/cache/refresh/leagues");
        try {
            cachedApiService.forceRefreshLeagues();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Ligas actualizadas desde la API"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}

