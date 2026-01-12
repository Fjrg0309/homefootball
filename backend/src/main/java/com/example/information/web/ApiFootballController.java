package com.example.information.web;

import com.example.information.model.apifootball.*;
import com.example.information.service.ApiFootballService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller para exponer los endpoints de API-Football
 * Actúa como proxy entre el frontend y la API externa
 */
@RestController
@RequestMapping("/api/football")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ApiFootballController {

    private final ApiFootballService apiFootballService;

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
            boolean configured = apiFootballService.isConfigured();
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
        return ResponseEntity.ok(apiFootballService.getLeagues());
    }

    /**
     * Obtener ligas por país
     */
    @GetMapping("/leagues/country/{country}")
    public ResponseEntity<LeagueResponse> getLeaguesByCountry(@PathVariable String country) {
        log.info("GET /api/football/leagues/country/{}", country);
        return ResponseEntity.ok(apiFootballService.getLeaguesByCountry(country));
    }

    /**
     * Obtener liga por ID
     */
    @GetMapping("/leagues/{id}")
    public ResponseEntity<LeagueResponse> getLeagueById(@PathVariable int id) {
        log.info("GET /api/football/leagues/{}", id);
        return ResponseEntity.ok(apiFootballService.getLeagueById(id));
    }

    // ==================== EQUIPOS ====================

    /**
     * Obtener equipos de una liga
     */
    @GetMapping("/teams")
    public ResponseEntity<TeamResponse> getTeamsByLeague(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/teams?league={}&season={}", league, season);
        return ResponseEntity.ok(apiFootballService.getTeamsByLeague(league, season));
    }

    /**
     * Obtener equipo por ID
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable int id) {
        log.info("GET /api/football/teams/{}", id);
        return ResponseEntity.ok(apiFootballService.getTeamById(id));
    }

    /**
     * Buscar equipos por nombre
     */
    @GetMapping("/teams/search")
    public ResponseEntity<TeamResponse> searchTeams(@RequestParam String name) {
        log.info("GET /api/football/teams/search?name={}", name);
        return ResponseEntity.ok(apiFootballService.searchTeams(name));
    }

    // ==================== JUGADORES ====================

    /**
     * Obtener jugadores de un equipo
     */
    @GetMapping("/players")
    public ResponseEntity<PlayerResponse> getPlayersByTeam(
            @RequestParam int team,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/players?team={}&season={}", team, season);
        return ResponseEntity.ok(apiFootballService.getPlayersByTeam(team, season));
    }

    /**
     * Obtener jugador por ID
     */
    @GetMapping("/players/{id}")
    public ResponseEntity<PlayerResponse> getPlayerById(
            @PathVariable int id,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/players/{}?season={}", id, season);
        return ResponseEntity.ok(apiFootballService.getPlayerById(id, season));
    }

    /**
     * Buscar jugadores por nombre
     */
    @GetMapping("/players/search")
    public ResponseEntity<PlayerResponse> searchPlayers(
            @RequestParam String name,
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/players/search?name={}&league={}&season={}", name, league, season);
        return ResponseEntity.ok(apiFootballService.searchPlayers(name, league, season));
    }

    /**
     * Obtener máximos goleadores de una liga
     */
    @GetMapping("/players/topscorers")
    public ResponseEntity<PlayerResponse> getTopScorers(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/players/topscorers?league={}&season={}", league, season);
        return ResponseEntity.ok(apiFootballService.getTopScorers(league, season));
    }

    // ==================== PARTIDOS ====================

    /**
     * Obtener partidos de una liga
     */
    @GetMapping("/fixtures")
    public ResponseEntity<FixtureResponse> getFixturesByLeague(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/fixtures?league={}&season={}", league, season);
        return ResponseEntity.ok(apiFootballService.getFixturesByLeague(league, season));
    }

    /**
     * Obtener partidos en vivo
     */
    @GetMapping("/fixtures/live")
    public ResponseEntity<FixtureResponse> getLiveFixtures() {
        log.info("GET /api/football/fixtures/live");
        return ResponseEntity.ok(apiFootballService.getLiveFixtures());
    }

    /**
     * Obtener partidos por fecha
     */
    @GetMapping("/fixtures/date/{date}")
    public ResponseEntity<FixtureResponse> getFixturesByDate(@PathVariable String date) {
        log.info("GET /api/football/fixtures/date/{}", date);
        return ResponseEntity.ok(apiFootballService.getFixturesByDate(date));
    }

    /**
     * Obtener partidos de un equipo
     */
    @GetMapping("/fixtures/team/{teamId}")
    public ResponseEntity<FixtureResponse> getFixturesByTeam(
            @PathVariable int teamId,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/fixtures/team/{}?season={}", teamId, season);
        return ResponseEntity.ok(apiFootballService.getFixturesByTeam(teamId, season));
    }

    /**
     * Obtener la última jornada completada de una liga
     * Devuelve los partidos más recientes finalizados
     */
    @GetMapping("/fixtures/latest-round")
    public ResponseEntity<FixtureResponse> getLatestRound(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/fixtures/latest-round?league={}&season={}", league, season);
        return ResponseEntity.ok(apiFootballService.getLatestRound(league, season));
    }

    /**
     * Obtener partidos de una jornada específica
     */
    @GetMapping("/fixtures/round")
    public ResponseEntity<FixtureResponse> getFixturesByRound(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season,
            @RequestParam String round) {
        log.info("GET /api/football/fixtures/round?league={}&season={}&round={}", league, season, round);
        return ResponseEntity.ok(apiFootballService.getFixturesByRound(league, season, round));
    }

    /**
     * Obtener la última fecha con datos disponibles para una liga
     */
    @GetMapping("/fixtures/latest-date")
    public ResponseEntity<Map<String, String>> getLatestAvailableDate(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/fixtures/latest-date?league={}&season={}", league, season);
        String latestDate = apiFootballService.getLatestAvailableDate(league, season);
        return ResponseEntity.ok(Map.of("date", latestDate));
    }

    // ==================== CLASIFICACIÓN ====================

    /**
     * Obtener clasificación de una liga
     */
    @GetMapping("/standings")
    public ResponseEntity<StandingsResponse> getStandings(
            @RequestParam int league,
            @RequestParam(defaultValue = "2022") int season) {
        log.info("GET /api/football/standings?league={}&season={}", league, season);
        return ResponseEntity.ok(apiFootballService.getStandings(league, season));
    }
}

