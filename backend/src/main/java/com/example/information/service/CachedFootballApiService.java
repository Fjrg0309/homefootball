package com.example.information.service;

import com.example.information.model.apifootball.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio fachada que gestiona la caché persistente de la API de fútbol.
 * 
 * Estrategia:
 * 1. Buscar primero en la base de datos (caché persistente)
 * 2. Si existe en caché, devolver datos cacheados
 * 3. Si no existe, llamar a la API externa y guardar en caché
 * 
 * Esto permite:
 * - Reducir drásticamente las peticiones a la API (límite 100/día)
 * - Tener datos disponibles incluso sin conexión o con API agotada
 * - Mejorar tiempos de respuesta
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CachedFootballApiService {

    private final ApiFootballService apiService;
    private final FootballCacheService cacheService;

    // ==================== LIGAS ====================

    /**
     * Obtiene todas las ligas.
     * Primero busca en caché de BD, si no hay datos llama a la API.
     */
    public LeagueResponse getLeagues() {
        log.info("🔍 Buscando ligas...");
        
        // 1. Buscar en caché de BD
        LeagueResponse cached = cacheService.getLeaguesFromCache();
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Ligas encontradas en caché de BD ({} resultados)", cached.getResponse().size());
            return cached;
        }
        
        // 2. No hay en caché, llamar a la API
        log.info("📡 Ligas no encontradas en caché, llamando a API...");
        try {
            LeagueResponse apiResponse = apiService.getLeagues();
            
            // 3. Guardar en caché de BD
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.saveLeagues(apiResponse);
                log.info("✅ {} ligas obtenidas de API y guardadas en caché", apiResponse.getResponse().size());
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API: {}", e.getMessage());
            // Si falla la API pero hay algo en caché (aunque sea parcial), devolverlo
            if (cached != null) {
                log.warn("⚠️ Devolviendo datos parciales de caché");
                return cached;
            }
            throw e;
        }
    }

    /**
     * Obtiene una liga por su ID.
     */
    public LeagueResponse getLeagueById(int leagueId) {
        log.info("🔍 Buscando liga {}...", leagueId);
        
        // 1. Buscar en caché de BD
        LeagueResponse cached = cacheService.getLeagueByIdFromCache(leagueId);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Liga {} encontrada en caché de BD", leagueId);
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Liga {} no encontrada en caché, llamando a API...", leagueId);
        try {
            LeagueResponse apiResponse = apiService.getLeagueById(leagueId);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.saveLeagues(apiResponse);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para liga {}: {}", leagueId, e.getMessage());
            throw e;
        }
    }

    /**
     * Obtiene ligas por país.
     */
    public LeagueResponse getLeaguesByCountry(String country) {
        log.info("🔍 Buscando ligas de {}...", country);
        
        // 1. Buscar en caché de BD
        LeagueResponse cached = cacheService.getLeaguesByCountryFromCache(country);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Ligas de {} encontradas en caché de BD ({} resultados)", country, cached.getResponse().size());
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Ligas de {} no encontradas en caché, llamando a API...", country);
        try {
            LeagueResponse apiResponse = apiService.getLeaguesByCountry(country);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.saveLeagues(apiResponse);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para ligas de {}: {}", country, e.getMessage());
            throw e;
        }
    }

    // ==================== EQUIPOS ====================

    /**
     * Obtiene equipos de una liga y temporada.
     */
    public TeamResponse getTeamsByLeague(int leagueId, int season) {
        log.info("🔍 Buscando equipos de liga {} temporada {}...", leagueId, season);
        
        // 1. Buscar en caché de BD
        TeamResponse cached = cacheService.getTeamsByLeagueFromCache(leagueId, season);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Equipos encontrados en caché de BD ({} resultados)", cached.getResponse().size());
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Equipos no encontrados en caché, llamando a API...");
        try {
            TeamResponse apiResponse = apiService.getTeamsByLeague(leagueId, season);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.saveTeams(apiResponse, leagueId, season);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para equipos: {}", e.getMessage());
            if (cached != null) return cached;
            throw e;
        }
    }

    /**
     * Obtiene un equipo por su ID.
     */
    public TeamResponse getTeamById(int teamId) {
        log.info("🔍 Buscando equipo {}...", teamId);
        
        // 1. Buscar en caché de BD
        TeamResponse cached = cacheService.getTeamByIdFromCache(teamId);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Equipo {} encontrado en caché de BD", teamId);
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Equipo {} no encontrado en caché, llamando a API...", teamId);
        try {
            TeamResponse apiResponse = apiService.getTeamById(teamId);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                for (TeamResponse.TeamData data : apiResponse.getResponse()) {
                    cacheService.saveTeam(data);
                }
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para equipo {}: {}", teamId, e.getMessage());
            throw e;
        }
    }

    /**
     * Busca equipos por nombre.
     * Primero busca en caché, luego en API si no encuentra suficientes resultados.
     */
    public TeamResponse searchTeams(String name) {
        log.info("🔍 Buscando equipos con nombre '{}'...", name);
        
        // 1. Buscar en caché de BD
        TeamResponse cached = cacheService.searchTeamsFromCache(name);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Equipos encontrados en caché de BD ({} resultados)", cached.getResponse().size());
            // Si hay suficientes resultados en caché, devolverlos
            if (cached.getResponse().size() >= 5) {
                return cached;
            }
        }
        
        // 2. Llamar a la API para obtener más resultados
        log.info("📡 Buscando más equipos en API...");
        try {
            TeamResponse apiResponse = apiService.searchTeams(name);
            
            // 3. Guardar nuevos equipos en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                for (TeamResponse.TeamData data : apiResponse.getResponse()) {
                    cacheService.saveTeam(data);
                }
                log.info("✅ {} equipos obtenidos de API y guardados en caché", apiResponse.getResponse().size());
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para búsqueda de equipos: {}", e.getMessage());
            // Si falla la API pero hay algo en caché, devolverlo
            if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
                log.warn("⚠️ Devolviendo {} resultados de caché", cached.getResponse().size());
                return cached;
            }
            throw e;
        }
    }

    // ==================== JUGADORES ====================

    /**
     * Obtiene jugadores de un equipo y temporada.
     */
    public PlayerResponse getPlayersByTeam(int teamId, int season) {
        log.info("🔍 Buscando jugadores del equipo {} temporada {}...", teamId, season);
        
        // 1. Buscar en caché de BD
        PlayerResponse cached = cacheService.getPlayersByTeamFromCache(teamId, season);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Jugadores encontrados en caché de BD ({} resultados)", cached.getResponse().size());
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Jugadores no encontrados en caché, llamando a API...");
        try {
            PlayerResponse apiResponse = apiService.getPlayersByTeam(teamId, season);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.savePlayers(apiResponse, teamId, null, season, null);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para jugadores: {}", e.getMessage());
            if (cached != null) return cached;
            throw e;
        }
    }

    /**
     * Obtiene un jugador por su ID.
     */
    public PlayerResponse getPlayerById(int playerId, int season) {
        log.info("🔍 Buscando jugador {} temporada {}...", playerId, season);
        
        // 1. Buscar en caché de BD
        PlayerResponse cached = cacheService.getPlayerByIdFromCache(playerId, season);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Jugador {} encontrado en caché de BD", playerId);
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Jugador {} no encontrado en caché, llamando a API...", playerId);
        try {
            PlayerResponse apiResponse = apiService.getPlayerById(playerId, season);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                for (PlayerResponse.PlayerData data : apiResponse.getResponse()) {
                    cacheService.savePlayer(data, null, null, season, null);
                }
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para jugador {}: {}", playerId, e.getMessage());
            throw e;
        }
    }

    /**
     * Busca jugadores por nombre.
     */
    public PlayerResponse searchPlayers(String name, int leagueId, int season) {
        log.info("🔍 Buscando jugadores con nombre '{}' liga {} temporada {}...", name, leagueId, season);
        
        // 1. Buscar en caché de BD
        PlayerResponse cached = cacheService.searchPlayersFromCache(name, leagueId, season);
        if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
            log.info("✅ Jugadores encontrados en caché de BD ({} resultados)", cached.getResponse().size());
            if (cached.getResponse().size() >= 3) {
                return cached;
            }
        }
        
        // 2. Llamar a la API
        log.info("📡 Buscando más jugadores en API...");
        try {
            PlayerResponse apiResponse = apiService.searchPlayers(name, leagueId, season);
            
            // 3. Guardar en caché
            if (apiResponse != null && apiResponse.getResponse() != null) {
                cacheService.savePlayers(apiResponse, null, leagueId, season, name.toLowerCase());
                log.info("✅ {} jugadores obtenidos de API y guardados en caché", apiResponse.getResponse().size());
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para búsqueda de jugadores: {}", e.getMessage());
            if (cached != null && cached.getResponse() != null && !cached.getResponse().isEmpty()) {
                return cached;
            }
            throw e;
        }
    }

    // ==================== CLASIFICACIONES ====================

    /**
     * Obtiene la clasificación de una liga.
     */
    public StandingsResponse getStandings(int leagueId, int season) {
        log.info("🔍 Buscando clasificación liga {} temporada {}...", leagueId, season);
        
        // 1. Buscar en caché de BD
        StandingsResponse cached = cacheService.getStandingsFromCache(leagueId, season);
        if (cached != null) {
            log.info("✅ Clasificación encontrada en caché de BD");
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Clasificación no encontrada en caché, llamando a API...");
        try {
            StandingsResponse apiResponse = apiService.getStandings(leagueId, season);
            
            // 3. Guardar en caché
            if (apiResponse != null) {
                cacheService.saveStandings(apiResponse, leagueId, season);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para clasificación: {}", e.getMessage());
            throw e;
        }
    }

    // ==================== PLANTILLAS ====================

    /**
     * Obtiene la plantilla de un equipo.
     */
    public SquadResponse getTeamSquad(int teamId) {
        log.info("🔍 Buscando plantilla del equipo {}...", teamId);
        
        // 1. Buscar en caché de BD
        SquadResponse cached = cacheService.getSquadFromCache(teamId);
        if (cached != null) {
            log.info("✅ Plantilla encontrada en caché de BD");
            return cached;
        }
        
        // 2. Llamar a la API
        log.info("📡 Plantilla no encontrada en caché, llamando a API...");
        try {
            SquadResponse apiResponse = apiService.getTeamSquad(teamId);
            
            // 3. Guardar en caché
            if (apiResponse != null) {
                cacheService.saveSquad(apiResponse, teamId);
            }
            
            return apiResponse;
        } catch (Exception e) {
            log.error("❌ Error llamando a API para plantilla: {}", e.getMessage());
            throw e;
        }
    }

    // ==================== MÉTODOS SIN CACHÉ (datos en tiempo real) ====================
    // Estos métodos no se cachean porque los datos cambian frecuentemente

    /**
     * Obtiene partidos en vivo (no se cachea)
     */
    public FixtureResponse getLiveFixtures() {
        return apiService.getLiveFixtures();
    }

    /**
     * Obtiene partidos por fecha (no se cachea)
     */
    public FixtureResponse getFixturesByDate(String date) {
        return apiService.getFixturesByDate(date);
    }

    /**
     * Obtiene partidos de una liga (se usa caché de memoria, no BD)
     */
    public FixtureResponse getFixturesByLeague(int leagueId, int season) {
        return apiService.getFixturesByLeague(leagueId, season);
    }

    /**
     * Obtiene partidos de un equipo (no se cachea en BD)
     */
    public FixtureResponse getFixturesByTeam(int teamId, int season) {
        return apiService.getFixturesByTeam(teamId, season);
    }

    /**
     * Obtiene la última jornada
     */
    public FixtureResponse getLatestRound(int leagueId, int season) {
        return apiService.getLatestRound(leagueId, season);
    }

    /**
     * Obtiene partidos de una jornada específica
     */
    public FixtureResponse getFixturesByRound(int leagueId, int season, String round) {
        return apiService.getFixturesByRound(leagueId, season, round);
    }

    /**
     * Obtiene la última fecha disponible con datos
     */
    public String getLatestAvailableDate(int leagueId, int season) {
        return apiService.getLatestAvailableDate(leagueId, season);
    }

    /**
     * Obtiene máximos goleadores
     */
    public PlayerResponse getTopScorers(int leagueId, int season) {
        return apiService.getTopScorers(leagueId, season);
    }

    /**
     * Obtiene un partido por ID
     */
    public FixtureResponse getFixtureById(int fixtureId) {
        return apiService.getFixtureById(fixtureId);
    }

    /**
     * Obtiene eventos de un partido
     */
    public FixtureEventsResponse getFixtureEvents(int fixtureId) {
        return apiService.getFixtureEvents(fixtureId);
    }

    /**
     * Obtiene estadísticas de un partido
     */
    public FixtureStatisticsResponse getFixtureStatistics(int fixtureId) {
        return apiService.getFixtureStatistics(fixtureId);
    }

    /**
     * Obtiene ligas de un equipo
     */
    public LeagueResponse getLeaguesByTeam(int teamId, int season) {
        return apiService.getLeaguesByTeam(teamId, season);
    }

    /**
     * Verifica si la API está configurada
     */
    public boolean isConfigured() {
        return apiService.isConfigured();
    }

    // ==================== ESTADÍSTICAS ====================

    /**
     * Obtiene estadísticas de la caché
     */
    public FootballCacheService.CacheStats getCacheStats() {
        return cacheService.getCacheStats();
    }

    /**
     * Fuerza actualización de ligas desde la API (ignora caché)
     */
    public void forceRefreshLeagues() {
        log.info("🔄 Forzando actualización de ligas desde API...");
        LeagueResponse apiResponse = apiService.getLeagues();
        if (apiResponse != null && apiResponse.getResponse() != null) {
            cacheService.saveLeagues(apiResponse);
            log.info("✅ {} ligas actualizadas desde API", apiResponse.getResponse().size());
        }
    }
}
