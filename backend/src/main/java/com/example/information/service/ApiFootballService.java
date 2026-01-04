package com.example.information.service;

import com.example.information.config.ApiFootballConfig;
import com.example.information.model.apifootball.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
     * Obtiene todas las ligas disponibles
     */
    public LeagueResponse getLeagues() {
        String url = baseUrl + "/leagues";
        log.info("Fetching leagues from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<LeagueResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, LeagueResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene ligas por país
     */
    public LeagueResponse getLeaguesByCountry(String country) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/leagues")
            .queryParam("country", country)
            .toUriString();
        
        log.info("Fetching leagues by country from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<LeagueResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, LeagueResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene una liga por su ID
     */
    public LeagueResponse getLeagueById(int leagueId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/leagues")
            .queryParam("id", leagueId)
            .toUriString();
        
        log.info("Fetching league by ID from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<LeagueResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, LeagueResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene equipos de una liga y temporada específica
     */
    public TeamResponse getTeamsByLeague(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching teams from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<TeamResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, TeamResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene información de un equipo por su ID
     */
    public TeamResponse getTeamById(int teamId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("id", teamId)
            .toUriString();
        
        log.info("Fetching team by ID from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<TeamResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, TeamResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Busca equipos por nombre
     */
    public TeamResponse searchTeams(String name) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/teams")
            .queryParam("search", name)
            .toUriString();
        
        log.info("Searching teams from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<TeamResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, TeamResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene jugadores de un equipo
     */
    public PlayerResponse getPlayersByTeam(int teamId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players")
            .queryParam("team", teamId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching players from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<PlayerResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, PlayerResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene información de un jugador por su ID
     */
    public PlayerResponse getPlayerById(int playerId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players")
            .queryParam("id", playerId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching player by ID from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<PlayerResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, PlayerResponse.class
        );
        
        return response.getBody();
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
        
        log.info("Searching players from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<PlayerResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, PlayerResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene partidos de una liga y temporada
     */
    public FixtureResponse getFixturesByLeague(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching fixtures from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<FixtureResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, FixtureResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene partidos en vivo
     */
    public FixtureResponse getLiveFixtures() {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("live", "all")
            .toUriString();
        
        log.info("Fetching live fixtures from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<FixtureResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, FixtureResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene partidos por fecha
     */
    public FixtureResponse getFixturesByDate(String date) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("date", date)
            .toUriString();
        
        log.info("Fetching fixtures by date from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<FixtureResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, FixtureResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene partidos de un equipo
     */
    public FixtureResponse getFixturesByTeam(int teamId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/fixtures")
            .queryParam("team", teamId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching fixtures by team from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<FixtureResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, FixtureResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene la clasificación de una liga
     */
    public StandingsResponse getStandings(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/standings")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching standings from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<StandingsResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, StandingsResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Obtiene los máximos goleadores de una liga
     */
    public PlayerResponse getTopScorers(int leagueId, int season) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/players/topscorers")
            .queryParam("league", leagueId)
            .queryParam("season", season)
            .toUriString();
        
        log.info("Fetching top scorers from API-Football: {}", url);
        
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<PlayerResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, PlayerResponse.class
        );
        
        return response.getBody();
    }

    /**
     * Verifica si la API key está configurada
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
