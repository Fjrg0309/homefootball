package com.example.information.service;

import com.example.information.model.apifootball.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para consumir la API de API-Football
 * Documentación: https://www.api-football.com/documentation-v3
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ApiFootballService {

    private final RestTemplate restTemplate;

    @Value("${api.football.key:}")
    private String apiKey;

    @Value("${api.football.base-url:https://v3.football.api-sports.io}")
    private String baseUrl;

    /**
     * Crea los headers necesarios para la API
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", "v3.football.api-sports.io");
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    /**
     * Método genérico para hacer peticiones con manejo de errores
     */
    private <T> T executeRequest(String url, Class<T> responseType) {
        try {
            log.info("=== EJECUTANDO PETICIÓN A API-FOOTBALL ===");
            log.info("URL: {}", url);
            
            if (apiKey == null || apiKey.isEmpty()) {
                log.error("API Key no configurada");
                throw new RuntimeException("API Key de API-Football no está configurada");
            }
            
            log.info("API Key configurada: {}...", apiKey.substring(0, Math.min(10, apiKey.length())));
            
            HttpEntity<String> entity = new HttpEntity<>(createHeaders());
            
            log.info("Realizando petición HTTP GET...");
            ResponseEntity<T> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, responseType
            );
            
            log.info("Respuesta recibida - Status: {}", response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("Petición exitosa a: {}", url);
                return response.getBody();
            } else {
                log.error("Error en la petición. Status: {}", response.getStatusCode());
                throw new RuntimeException("Error en la respuesta de la API: " + response.getStatusCode());
            }
            
        } catch (RestClientException e) {
            log.error("Error de conexión con API-Football: {}", e.getMessage());
            log.error("Causa: {}", e.getCause() != null ? e.getCause().getMessage() : "Sin causa");
            log.error("Stack trace:", e);
            throw new RuntimeException("Error de conexión con API-Football: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error inesperado al consultar API-Football: {}", e.getMessage());
            log.error("Tipo de error: {}", e.getClass().getName());
            log.error("Stack trace:", e);
            throw new RuntimeException("Error al consultar API-Football: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene todas las ligas disponibles
     */
    public LeagueResponse getLeagues() {
        String url = baseUrl + "/leagues";
        return executeRequest(url, LeagueResponse.class);
    }

    /**
     * Obtiene ligas por país
     */
    public LeagueResponse getLeaguesByCountry(String country) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/leagues")
            .queryParam("country", country)
            .toUriString();
        return executeRequest(url, LeagueResponse.class);
    }

    /**
     * Obtiene una liga por su ID
     */
    public LeagueResponse getLeagueById(int leagueId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/leagues")
            .queryParam("id", leagueId)
            .toUriString();
        return executeRequest(url, LeagueResponse.class);
    }

    /**
     * Obtiene equipos de una liga y temporada específica
     */
    public TeamResponse getTeamsByLeague(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, TeamResponse.class);
    }

    /**
     * Obtiene información de un equipo por su ID
     */
    public TeamResponse getTeamById(int teamId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("id", teamId)
            .toUriString();
        return executeRequest(url, TeamResponse.class);
    }

    /**
     * Busca equipos por nombre
     */
    public TeamResponse searchTeams(String name) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("search", name)
            .toUriString();
        return executeRequest(url, TeamResponse.class);
    }

    /**
     * Obtiene jugadores de un equipo
     */
    public PlayerResponse getPlayersByTeam(int teamId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players")
            .queryParam("team", teamId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, PlayerResponse.class);
    }

    /**
     * Obtiene información de un jugador por su ID
     */
    public PlayerResponse getPlayerById(int playerId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players")
            .queryParam("id", playerId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, PlayerResponse.class);
    }

    /**
     * Busca jugadores por nombre
     */
    public PlayerResponse searchPlayers(String name, int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players")
            .queryParam("search", name)
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, PlayerResponse.class);
    }

    /**
     * Obtiene partidos de una liga y temporada
     */
    public FixtureResponse getFixturesByLeague(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, FixtureResponse.class);
    }

    /**
     * Obtiene partidos en vivo
     */
    public FixtureResponse getLiveFixtures() {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("live", "all")
            .toUriString();
        return executeRequest(url, FixtureResponse.class);
    }

    /**
     * Obtiene partidos por fecha
     */
    public FixtureResponse getFixturesByDate(String date) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("date", date)
            .toUriString();
        return executeRequest(url, FixtureResponse.class);
    }

    /**
     * Obtiene partidos de un equipo
     */
    public FixtureResponse getFixturesByTeam(int teamId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("team", teamId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, FixtureResponse.class);
    }

    /**
     * Obtiene la clasificación de una liga
     */
    public StandingsResponse getStandings(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/standings")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, StandingsResponse.class);
    }

    /**
     * Obtiene los máximos goleadores de una liga
     */
    public PlayerResponse getTopScorers(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players/topscorers")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        return executeRequest(url, PlayerResponse.class);
    }

    /**
     * Obtiene la última jornada completada de una liga
     * Busca los partidos más recientes que estén finalizados
     */
    public FixtureResponse getLatestRound(int leagueId, int season) {
        log.info("Obteniendo última jornada de la liga {} temporada {}", leagueId, season);
        
        try {
            // Obtener todos los partidos de la liga
            FixtureResponse allFixtures = getFixturesByLeague(leagueId, season);
            
            if (allFixtures == null || allFixtures.getResponse() == null || allFixtures.getResponse().isEmpty()) {
                log.warn("No se encontraron partidos para la liga {} temporada {}", leagueId, season);
                // Crear respuesta vacía pero válida
                FixtureResponse emptyResponse = new FixtureResponse();
                emptyResponse.setResponse(List.of());
                emptyResponse.setResults(0);
                return emptyResponse;
            }
            
            // Filtrar solo partidos finalizados y ordenar por fecha descendente
            List<FixtureResponse.FixtureData> finishedFixtures = allFixtures.getResponse().stream()
                .filter(f -> f.getFixture() != null && f.getFixture().getStatus() != null)
                .filter(f -> "Match Finished".equals(f.getFixture().getStatus().getLongStatus()) || 
                            "FT".equals(f.getFixture().getStatus().getShortStatus()))
                .sorted(Comparator.comparing(
                    f -> f.getFixture().getTimestamp(), 
                    Comparator.reverseOrder()
                ))
                .collect(Collectors.toList());
            
            if (finishedFixtures.isEmpty()) {
                log.warn("No se encontraron partidos finalizados para la liga {} temporada {}", leagueId, season);
                // Crear respuesta vacía pero válida
                FixtureResponse emptyResponse = new FixtureResponse();
                emptyResponse.setResponse(List.of());
                emptyResponse.setResults(0);
                return emptyResponse;
            }
            
            // Obtener la jornada más reciente
            String latestRound = finishedFixtures.get(0).getLeague().getRound();
            log.info("Última jornada encontrada: {}", latestRound);
            
            // Filtrar todos los partidos de esa jornada
            List<FixtureResponse.FixtureData> latestRoundFixtures = finishedFixtures.stream()
                .filter(f -> latestRound.equals(f.getLeague().getRound()))
                .collect(Collectors.toList());
            
            // Crear respuesta con solo los partidos de la última jornada
            FixtureResponse response = new FixtureResponse();
            response.setResponse(latestRoundFixtures);
            response.setResults(latestRoundFixtures.size());
            
            log.info("Se encontraron {} partidos en la última jornada: {}", latestRoundFixtures.size(), latestRound);
            return response;
            
        } catch (Exception e) {
            log.error("Error al obtener la última jornada de la liga {}: {}", leagueId, e.getMessage(), e);
            throw new RuntimeException("Error al obtener la última jornada: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtiene partidos de una jornada específica
     */
    public FixtureResponse getFixturesByRound(int leagueId, int season, String round) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .queryParam("round", round)
            .toUriString();
        return executeRequest(url, FixtureResponse.class);
    }
    
    /**
     * Obtiene la fecha más reciente con datos disponibles
     * Útil para obtener partidos recientes cuando no hay datos en vivo
     */
    public String getLatestAvailableDate(int leagueId, int season) {
        log.info("Buscando última fecha con datos disponibles para liga {} temporada {}", leagueId, season);
        
        try {
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            // Intentar obtener partidos de los últimos 30 días
            for (int i = 0; i < 30; i++) {
                LocalDate checkDate = today.minusDays(i);
                String dateStr = checkDate.format(formatter);
                
                String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
                    .queryParam("league", leagueId)
                    .queryParam("date", dateStr)
                    .toUriString();
                
                try {
                    FixtureResponse response = executeRequest(url, FixtureResponse.class);
                    
                    if (response != null && response.getResponse() != null && !response.getResponse().isEmpty()) {
                        log.info("Última fecha con datos: {}", dateStr);
                        return dateStr;
                    }
                } catch (Exception e) {
                    log.debug("No hay datos para la fecha {}: {}", dateStr, e.getMessage());
                }
            }
            
            log.warn("No se encontraron datos en los últimos 30 días para la liga {}", leagueId);
            return today.format(formatter);
            
        } catch (Exception e) {
            log.error("Error al buscar última fecha disponible: {}", e.getMessage(), e);
            throw new RuntimeException("Error al buscar última fecha disponible: " + e.getMessage(), e);
        }
    }

    /**
     * Verifica si la API key está configurada
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
