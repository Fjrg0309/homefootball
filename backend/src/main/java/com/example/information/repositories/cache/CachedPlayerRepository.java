package com.example.information.repositories.cache;

import com.example.information.entities.cache.CachedPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para acceder a los jugadores cacheados en base de datos.
 */
@Repository
public interface CachedPlayerRepository extends JpaRepository<CachedPlayer, Long> {
    
    /**
     * Busca un jugador por su ID de API-Football
     */
    Optional<CachedPlayer> findFirstByApiId(Integer apiId);
    
    /**
     * Busca un jugador por ID y temporada
     */
    Optional<CachedPlayer> findByApiIdAndSeason(Integer apiId, Integer season);
    
    /**
     * Verifica si existe un jugador por su ID de API
     */
    boolean existsByApiId(Integer apiId);
    
    /**
     * Busca jugadores por equipo y temporada
     */
    List<CachedPlayer> findByTeamIdAndSeason(Integer teamId, Integer season);
    
    /**
     * Verifica si existen jugadores para un equipo y temporada
     */
    boolean existsByTeamIdAndSeason(Integer teamId, Integer season);
    
    /**
     * Busca jugadores cuyo nombre contiene el texto (case insensitive)
     */
    @Query("SELECT p FROM CachedPlayer p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<CachedPlayer> searchByName(@Param("search") String search);
    
    /**
     * Busca jugadores por nombre en una liga específica
     */
    @Query("SELECT p FROM CachedPlayer p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) AND p.leagueId = :leagueId AND p.season = :season")
    List<CachedPlayer> searchByNameAndLeague(@Param("search") String search, @Param("leagueId") Integer leagueId, @Param("season") Integer season);
    
    /**
     * Busca jugadores por clave de búsqueda
     */
    List<CachedPlayer> findBySearchKeyContainingIgnoreCase(String searchKey);
    
    /**
     * Busca jugadores por nacionalidad
     */
    List<CachedPlayer> findByNationalityIgnoreCase(String nationality);
}
