package com.example.information.service;

import com.example.information.entities.cache.*;
import com.example.information.model.apifootball.*;
import com.example.information.repositories.cache.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de caché persistente en base de datos.
 * Almacena y recupera datos de la API-Football para evitar peticiones repetidas.
 * 
 * Estrategia:
 * 1. Buscar primero en la base de datos
 * 2. Si no existe, llamar a la API y guardar en BD
 * 3. Los datos se actualizan periódicamente o bajo demanda
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FootballCacheService {

    private final CachedLeagueRepository leagueRepository;
    private final CachedTeamRepository teamRepository;
    private final CachedPlayerRepository playerRepository;
    private final CachedStandingsRepository standingsRepository;
    private final CachedSquadRepository squadRepository;
    private final ObjectMapper objectMapper;

    // ==================== LIGAS ====================

    /**
     * Guarda ligas en la caché de base de datos
     */
    public void saveLeagues(LeagueResponse response) {
        if (response == null || response.getResponse() == null) return;
        
        log.info("💾 Guardando {} ligas en caché de BD", response.getResponse().size());
        
        for (LeagueResponse.LeagueData data : response.getResponse()) {
            try {
                if (!leagueRepository.existsByApiId(data.getLeague().getId())) {
                    CachedLeague cached = CachedLeague.builder()
                        .apiId(data.getLeague().getId())
                        .name(data.getLeague().getName())
                        .type(data.getLeague().getType())
                        .logo(data.getLeague().getLogo())
                        .countryName(data.getCountry().getName())
                        .countryCode(data.getCountry().getCode())
                        .countryFlag(data.getCountry().getFlag())
                        .currentSeason(getCurrentSeason(data.getSeasons()))
                        .rawJson(objectMapper.writeValueAsString(data))
                        .build();
                    leagueRepository.save(cached);
                }
            } catch (JsonProcessingException e) {
                log.error("Error serializando liga {}: {}", data.getLeague().getName(), e.getMessage());
            }
        }
        log.info("✅ Ligas guardadas en caché de BD");
    }

    /**
     * Obtiene todas las ligas de la caché
     */
    public LeagueResponse getLeaguesFromCache() {
        List<CachedLeague> cached = leagueRepository.findAll();
        if (cached.isEmpty()) {
            log.info("📭 No hay ligas en caché de BD");
            return null;
        }
        
        log.info("📦 Recuperando {} ligas de caché de BD", cached.size());
        return convertToLeagueResponse(cached);
    }

    /**
     * Obtiene una liga por ID de la caché
     */
    public LeagueResponse getLeagueByIdFromCache(int apiId) {
        Optional<CachedLeague> cached = leagueRepository.findByApiId(apiId);
        if (cached.isEmpty()) {
            log.info("📭 Liga {} no encontrada en caché de BD", apiId);
            return null;
        }
        
        log.info("📦 Liga {} recuperada de caché de BD", apiId);
        return convertToLeagueResponse(List.of(cached.get()));
    }

    /**
     * Obtiene ligas por país de la caché
     */
    public LeagueResponse getLeaguesByCountryFromCache(String country) {
        List<CachedLeague> cached = leagueRepository.findByCountryNameIgnoreCase(country);
        if (cached.isEmpty()) {
            log.info("📭 No hay ligas de {} en caché de BD", country);
            return null;
        }
        
        log.info("📦 Recuperando {} ligas de {} de caché de BD", cached.size(), country);
        return convertToLeagueResponse(cached);
    }

    /**
     * Verifica si hay ligas en caché
     */
    public boolean hasLeaguesInCache() {
        return leagueRepository.count() > 0;
    }

    // ==================== EQUIPOS ====================

    /**
     * Guarda equipos en la caché de base de datos
     */
    public void saveTeams(TeamResponse response, Integer leagueId, Integer season) {
        if (response == null || response.getResponse() == null) return;
        
        log.info("💾 Guardando {} equipos en caché de BD (liga={}, season={})", 
                response.getResponse().size(), leagueId, season);
        
        for (TeamResponse.TeamData data : response.getResponse()) {
            try {
                // Buscar si ya existe para esta liga/temporada
                Optional<CachedTeam> existing = teamRepository.findFirstByApiId(data.getTeam().getId());
                
                CachedTeam cached;
                if (existing.isPresent() && existing.get().getLeagueId() != null 
                    && existing.get().getLeagueId().equals(leagueId) 
                    && existing.get().getSeason() != null 
                    && existing.get().getSeason().equals(season)) {
                    // Actualizar existente
                    cached = existing.get();
                } else {
                    // Crear nuevo
                    cached = new CachedTeam();
                }
                
                cached.setApiId(data.getTeam().getId());
                cached.setName(data.getTeam().getName());
                cached.setCode(data.getTeam().getCode());
                cached.setCountry(data.getTeam().getCountry());
                cached.setFounded(data.getTeam().getFounded());
                cached.setNational(data.getTeam().isNational());
                cached.setLogo(data.getTeam().getLogo());
                cached.setLeagueId(leagueId);
                cached.setSeason(season);
                cached.setRawJson(objectMapper.writeValueAsString(data));
                
                if (data.getVenue() != null) {
                    cached.setVenueId(data.getVenue().getId());
                    cached.setVenueName(data.getVenue().getName());
                    cached.setVenueAddress(data.getVenue().getAddress());
                    cached.setVenueCity(data.getVenue().getCity());
                    cached.setVenueCapacity(data.getVenue().getCapacity());
                    cached.setVenueSurface(data.getVenue().getSurface());
                    cached.setVenueImage(data.getVenue().getImage());
                }
                
                teamRepository.save(cached);
            } catch (JsonProcessingException e) {
                log.error("Error serializando equipo {}: {}", data.getTeam().getName(), e.getMessage());
            }
        }
        log.info("✅ Equipos guardados en caché de BD");
    }

    /**
     * Guarda un equipo individual (de búsqueda)
     */
    public void saveTeam(TeamResponse.TeamData data) {
        if (data == null) return;
        
        try {
            if (!teamRepository.existsByApiId(data.getTeam().getId())) {
                CachedTeam cached = CachedTeam.builder()
                    .apiId(data.getTeam().getId())
                    .name(data.getTeam().getName())
                    .code(data.getTeam().getCode())
                    .country(data.getTeam().getCountry())
                    .founded(data.getTeam().getFounded())
                    .national(data.getTeam().isNational())
                    .logo(data.getTeam().getLogo())
                    .rawJson(objectMapper.writeValueAsString(data))
                    .build();
                
                if (data.getVenue() != null) {
                    cached.setVenueId(data.getVenue().getId());
                    cached.setVenueName(data.getVenue().getName());
                    cached.setVenueAddress(data.getVenue().getAddress());
                    cached.setVenueCity(data.getVenue().getCity());
                    cached.setVenueCapacity(data.getVenue().getCapacity());
                    cached.setVenueSurface(data.getVenue().getSurface());
                    cached.setVenueImage(data.getVenue().getImage());
                }
                
                teamRepository.save(cached);
                log.info("💾 Equipo {} guardado en caché de BD", data.getTeam().getName());
            }
        } catch (JsonProcessingException e) {
            log.error("Error serializando equipo {}: {}", data.getTeam().getName(), e.getMessage());
        }
    }

    /**
     * Obtiene equipos por liga y temporada de la caché
     */
    public TeamResponse getTeamsByLeagueFromCache(int leagueId, int season) {
        List<CachedTeam> cached = teamRepository.findByLeagueIdAndSeason(leagueId, season);
        if (cached.isEmpty()) {
            log.info("📭 No hay equipos para liga {} season {} en caché de BD", leagueId, season);
            return null;
        }
        
        log.info("📦 Recuperando {} equipos de caché de BD", cached.size());
        return convertToTeamResponse(cached);
    }

    /**
     * Obtiene un equipo por ID de la caché
     */
    public TeamResponse getTeamByIdFromCache(int apiId) {
        Optional<CachedTeam> cached = teamRepository.findFirstByApiId(apiId);
        if (cached.isEmpty()) {
            log.info("📭 Equipo {} no encontrado en caché de BD", apiId);
            return null;
        }
        
        log.info("📦 Equipo {} recuperado de caché de BD", apiId);
        return convertToTeamResponse(List.of(cached.get()));
    }

    /**
     * Busca equipos por nombre en la caché
     */
    public TeamResponse searchTeamsFromCache(String name) {
        List<CachedTeam> cached = teamRepository.searchByName(name);
        if (cached.isEmpty()) {
            log.info("📭 No hay equipos con nombre '{}' en caché de BD", name);
            return null;
        }
        
        log.info("📦 Encontrados {} equipos con nombre '{}' en caché de BD", cached.size(), name);
        return convertToTeamResponse(cached);
    }

    /**
     * Verifica si hay equipos para una liga/temporada en caché
     */
    public boolean hasTeamsInCache(int leagueId, int season) {
        return teamRepository.existsByLeagueIdAndSeason(leagueId, season);
    }

    // ==================== JUGADORES ====================

    /**
     * Guarda jugadores en la caché de base de datos
     */
    public void savePlayers(PlayerResponse response, Integer teamId, Integer leagueId, Integer season, String searchKey) {
        if (response == null || response.getResponse() == null) return;
        
        log.info("💾 Guardando {} jugadores en caché de BD", response.getResponse().size());
        
        for (PlayerResponse.PlayerData data : response.getResponse()) {
            try {
                savePlayer(data, teamId, leagueId, season, searchKey);
            } catch (Exception e) {
                log.error("Error guardando jugador {}: {}", data.getPlayer().getName(), e.getMessage());
            }
        }
        log.info("✅ Jugadores guardados en caché de BD");
    }

    /**
     * Guarda un jugador individual
     */
    public void savePlayer(PlayerResponse.PlayerData data, Integer teamId, Integer leagueId, Integer season, String searchKey) {
        if (data == null) return;
        
        try {
            // No duplicar si ya existe para esta temporada
            if (playerRepository.existsByApiId(data.getPlayer().getId())) {
                return;
            }
            
            CachedPlayer cached = CachedPlayer.builder()
                .apiId(data.getPlayer().getId())
                .name(data.getPlayer().getName())
                .firstname(data.getPlayer().getFirstname())
                .lastname(data.getPlayer().getLastname())
                .age(data.getPlayer().getAge())
                .nationality(data.getPlayer().getNationality())
                .height(data.getPlayer().getHeight())
                .weight(data.getPlayer().getWeight())
                .photo(data.getPlayer().getPhoto())
                .injured(data.getPlayer().isInjured())
                .teamId(teamId)
                .leagueId(leagueId)
                .season(season)
                .searchKey(searchKey)
                .rawJson(objectMapper.writeValueAsString(data))
                .build();
            
            if (data.getPlayer().getBirth() != null) {
                cached.setBirthDate(data.getPlayer().getBirth().getDate());
                cached.setBirthPlace(data.getPlayer().getBirth().getPlace());
                cached.setBirthCountry(data.getPlayer().getBirth().getCountry());
            }
            
            // Extraer datos del equipo/liga de las estadísticas
            if (data.getStatistics() != null && !data.getStatistics().isEmpty()) {
                PlayerResponse.Statistics stats = data.getStatistics().get(0);
                if (stats.getTeam() != null) {
                    cached.setTeamId(stats.getTeam().getId());
                    cached.setTeamName(stats.getTeam().getName());
                    cached.setTeamLogo(stats.getTeam().getLogo());
                }
                if (stats.getLeague() != null) {
                    cached.setLeagueId(stats.getLeague().getId());
                    cached.setLeagueName(stats.getLeague().getName());
                }
                if (stats.getGames() != null) {
                    cached.setPosition(stats.getGames().getPosition());
                }
            }
            
            playerRepository.save(cached);
            log.debug("💾 Jugador {} guardado en caché de BD", data.getPlayer().getName());
        } catch (JsonProcessingException e) {
            log.error("Error serializando jugador {}: {}", data.getPlayer().getName(), e.getMessage());
        }
    }

    /**
     * Obtiene jugadores por equipo y temporada de la caché
     */
    public PlayerResponse getPlayersByTeamFromCache(int teamId, int season) {
        List<CachedPlayer> cached = playerRepository.findByTeamIdAndSeason(teamId, season);
        if (cached.isEmpty()) {
            log.info("📭 No hay jugadores para equipo {} season {} en caché de BD", teamId, season);
            return null;
        }
        
        log.info("📦 Recuperando {} jugadores de caché de BD", cached.size());
        return convertToPlayerResponse(cached);
    }

    /**
     * Obtiene un jugador por ID de la caché
     */
    public PlayerResponse getPlayerByIdFromCache(int apiId, int season) {
        Optional<CachedPlayer> cached = playerRepository.findByApiIdAndSeason(apiId, season);
        if (cached.isEmpty()) {
            // Intentar buscar sin temporada
            cached = playerRepository.findFirstByApiId(apiId);
        }
        if (cached.isEmpty()) {
            log.info("📭 Jugador {} no encontrado en caché de BD", apiId);
            return null;
        }
        
        log.info("📦 Jugador {} recuperado de caché de BD", apiId);
        return convertToPlayerResponse(List.of(cached.get()));
    }

    /**
     * Busca jugadores por nombre en la caché
     */
    public PlayerResponse searchPlayersFromCache(String name, int leagueId, int season) {
        List<CachedPlayer> cached = playerRepository.searchByNameAndLeague(name, leagueId, season);
        if (cached.isEmpty()) {
            // Buscar sin filtro de liga
            cached = playerRepository.searchByName(name);
        }
        if (cached.isEmpty()) {
            log.info("📭 No hay jugadores con nombre '{}' en caché de BD", name);
            return null;
        }
        
        log.info("📦 Encontrados {} jugadores con nombre '{}' en caché de BD", cached.size(), name);
        return convertToPlayerResponse(cached);
    }

    // ==================== CLASIFICACIONES ====================

    /**
     * Guarda clasificación en la caché
     */
    public void saveStandings(StandingsResponse response, int leagueId, int season) {
        if (response == null) return;
        
        try {
            // Eliminar clasificación anterior si existe
            standingsRepository.deleteByLeagueIdAndSeason(leagueId, season);
            
            CachedStandings cached = CachedStandings.builder()
                .leagueId(leagueId)
                .season(season)
                .rawJson(objectMapper.writeValueAsString(response))
                .build();
            
            standingsRepository.save(cached);
            log.info("💾 Clasificación liga {} season {} guardada en caché de BD", leagueId, season);
        } catch (JsonProcessingException e) {
            log.error("Error serializando clasificación: {}", e.getMessage());
        }
    }

    /**
     * Obtiene clasificación de la caché
     */
    public StandingsResponse getStandingsFromCache(int leagueId, int season) {
        Optional<CachedStandings> cached = standingsRepository.findByLeagueIdAndSeason(leagueId, season);
        if (cached.isEmpty()) {
            log.info("📭 No hay clasificación para liga {} season {} en caché de BD", leagueId, season);
            return null;
        }
        
        try {
            log.info("📦 Clasificación liga {} season {} recuperada de caché de BD", leagueId, season);
            return objectMapper.readValue(cached.get().getRawJson(), StandingsResponse.class);
        } catch (JsonProcessingException e) {
            log.error("Error deserializando clasificación: {}", e.getMessage());
            return null;
        }
    }

    // ==================== PLANTILLAS ====================

    /**
     * Guarda plantilla en la caché
     */
    public void saveSquad(SquadResponse response, int teamId) {
        if (response == null) return;
        
        try {
            // Eliminar plantilla anterior si existe
            squadRepository.deleteByTeamId(teamId);
            
            CachedSquad cached = CachedSquad.builder()
                .teamId(teamId)
                .rawJson(objectMapper.writeValueAsString(response))
                .build();
            
            squadRepository.save(cached);
            log.info("💾 Plantilla equipo {} guardada en caché de BD", teamId);
        } catch (JsonProcessingException e) {
            log.error("Error serializando plantilla: {}", e.getMessage());
        }
    }

    /**
     * Obtiene plantilla de la caché
     */
    public SquadResponse getSquadFromCache(int teamId) {
        Optional<CachedSquad> cached = squadRepository.findByTeamId(teamId);
        if (cached.isEmpty()) {
            log.info("📭 No hay plantilla para equipo {} en caché de BD", teamId);
            return null;
        }
        
        try {
            log.info("📦 Plantilla equipo {} recuperada de caché de BD", teamId);
            return objectMapper.readValue(cached.get().getRawJson(), SquadResponse.class);
        } catch (JsonProcessingException e) {
            log.error("Error deserializando plantilla: {}", e.getMessage());
            return null;
        }
    }

    // ==================== MÉTODOS DE CONVERSIÓN ====================

    private LeagueResponse convertToLeagueResponse(List<CachedLeague> cached) {
        LeagueResponse response = new LeagueResponse();
        response.setResults(cached.size());
        
        List<LeagueResponse.LeagueData> data = cached.stream()
            .map(this::convertToLeagueData)
            .collect(Collectors.toList());
        
        response.setResponse(data);
        return response;
    }

    private LeagueResponse.LeagueData convertToLeagueData(CachedLeague cached) {
        // Intentar deserializar el JSON original
        if (cached.getRawJson() != null) {
            try {
                return objectMapper.readValue(cached.getRawJson(), LeagueResponse.LeagueData.class);
            } catch (JsonProcessingException e) {
                log.debug("No se pudo deserializar JSON de liga, creando desde campos");
            }
        }
        
        // Crear desde los campos individuales
        LeagueResponse.LeagueData data = new LeagueResponse.LeagueData();
        
        LeagueResponse.League league = new LeagueResponse.League();
        league.setId(cached.getApiId());
        league.setName(cached.getName());
        league.setType(cached.getType());
        league.setLogo(cached.getLogo());
        data.setLeague(league);
        
        LeagueResponse.Country country = new LeagueResponse.Country();
        country.setName(cached.getCountryName());
        country.setCode(cached.getCountryCode());
        country.setFlag(cached.getCountryFlag());
        data.setCountry(country);
        
        return data;
    }

    private TeamResponse convertToTeamResponse(List<CachedTeam> cached) {
        TeamResponse response = new TeamResponse();
        response.setResults(cached.size());
        
        List<TeamResponse.TeamData> data = cached.stream()
            .map(this::convertToTeamData)
            .collect(Collectors.toList());
        
        response.setResponse(data);
        return response;
    }

    private TeamResponse.TeamData convertToTeamData(CachedTeam cached) {
        // Intentar deserializar el JSON original
        if (cached.getRawJson() != null) {
            try {
                return objectMapper.readValue(cached.getRawJson(), TeamResponse.TeamData.class);
            } catch (JsonProcessingException e) {
                log.debug("No se pudo deserializar JSON de equipo, creando desde campos");
            }
        }
        
        // Crear desde los campos individuales
        TeamResponse.TeamData data = new TeamResponse.TeamData();
        
        TeamResponse.Team team = new TeamResponse.Team();
        team.setId(cached.getApiId());
        team.setName(cached.getName());
        team.setCode(cached.getCode());
        team.setCountry(cached.getCountry());
        team.setFounded(cached.getFounded() != null ? cached.getFounded() : 0);
        team.setNational(cached.getNational() != null ? cached.getNational() : false);
        team.setLogo(cached.getLogo());
        data.setTeam(team);
        
        if (cached.getVenueId() != null) {
            TeamResponse.Venue venue = new TeamResponse.Venue();
            venue.setId(cached.getVenueId());
            venue.setName(cached.getVenueName());
            venue.setAddress(cached.getVenueAddress());
            venue.setCity(cached.getVenueCity());
            venue.setCapacity(cached.getVenueCapacity() != null ? cached.getVenueCapacity() : 0);
            venue.setSurface(cached.getVenueSurface());
            venue.setImage(cached.getVenueImage());
            data.setVenue(venue);
        }
        
        return data;
    }

    private PlayerResponse convertToPlayerResponse(List<CachedPlayer> cached) {
        PlayerResponse response = new PlayerResponse();
        response.setResults(cached.size());
        
        List<PlayerResponse.PlayerData> data = cached.stream()
            .map(this::convertToPlayerData)
            .collect(Collectors.toList());
        
        response.setResponse(data);
        return response;
    }

    private PlayerResponse.PlayerData convertToPlayerData(CachedPlayer cached) {
        // Intentar deserializar el JSON original
        if (cached.getRawJson() != null) {
            try {
                return objectMapper.readValue(cached.getRawJson(), PlayerResponse.PlayerData.class);
            } catch (JsonProcessingException e) {
                log.debug("No se pudo deserializar JSON de jugador, creando desde campos");
            }
        }
        
        // Crear desde los campos individuales
        PlayerResponse.PlayerData data = new PlayerResponse.PlayerData();
        
        PlayerResponse.Player player = new PlayerResponse.Player();
        player.setId(cached.getApiId());
        player.setName(cached.getName());
        player.setFirstname(cached.getFirstname());
        player.setLastname(cached.getLastname());
        player.setAge(cached.getAge() != null ? cached.getAge() : 0);
        player.setNationality(cached.getNationality());
        player.setHeight(cached.getHeight());
        player.setWeight(cached.getWeight());
        player.setPhoto(cached.getPhoto());
        player.setInjured(cached.getInjured() != null ? cached.getInjured() : false);
        
        if (cached.getBirthDate() != null) {
            PlayerResponse.Birth birth = new PlayerResponse.Birth();
            birth.setDate(cached.getBirthDate());
            birth.setPlace(cached.getBirthPlace());
            birth.setCountry(cached.getBirthCountry());
            player.setBirth(birth);
        }
        
        data.setPlayer(player);
        
        // Crear estadísticas básicas
        List<PlayerResponse.Statistics> statistics = new ArrayList<>();
        PlayerResponse.Statistics stats = new PlayerResponse.Statistics();
        
        if (cached.getTeamId() != null) {
            PlayerResponse.StatTeam statTeam = new PlayerResponse.StatTeam();
            statTeam.setId(cached.getTeamId());
            statTeam.setName(cached.getTeamName());
            statTeam.setLogo(cached.getTeamLogo());
            stats.setTeam(statTeam);
        }
        
        if (cached.getLeagueId() != null) {
            PlayerResponse.StatLeague statLeague = new PlayerResponse.StatLeague();
            statLeague.setId(cached.getLeagueId());
            statLeague.setName(cached.getLeagueName());
            stats.setLeague(statLeague);
        }
        
        if (cached.getPosition() != null) {
            PlayerResponse.Games games = new PlayerResponse.Games();
            games.setPosition(cached.getPosition());
            stats.setGames(games);
        }
        
        statistics.add(stats);
        data.setStatistics(statistics);
        
        return data;
    }

    private Integer getCurrentSeason(List<LeagueResponse.Season> seasons) {
        if (seasons == null || seasons.isEmpty()) return null;
        
        return seasons.stream()
            .filter(LeagueResponse.Season::isCurrent)
            .map(LeagueResponse.Season::getYear)
            .findFirst()
            .orElse(seasons.get(0).getYear());
    }

    // ==================== ESTADÍSTICAS DE CACHÉ ====================

    /**
     * Obtiene estadísticas de la caché
     */
    public CacheStats getCacheStats() {
        return new CacheStats(
            leagueRepository.count(),
            teamRepository.count(),
            playerRepository.count(),
            standingsRepository.count(),
            squadRepository.count()
        );
    }

    public record CacheStats(long leagues, long teams, long players, long standings, long squads) {}
}
