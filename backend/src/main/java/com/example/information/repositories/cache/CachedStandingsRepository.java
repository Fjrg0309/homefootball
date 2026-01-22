package com.example.information.repositories.cache;

import com.example.information.entities.cache.CachedStandings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para acceder a las clasificaciones cacheadas en base de datos.
 */
@Repository
public interface CachedStandingsRepository extends JpaRepository<CachedStandings, Long> {
    
    /**
     * Busca clasificación por liga y temporada
     */
    Optional<CachedStandings> findByLeagueIdAndSeason(Integer leagueId, Integer season);
    
    /**
     * Verifica si existe clasificación para liga y temporada
     */
    boolean existsByLeagueIdAndSeason(Integer leagueId, Integer season);
    
    /**
     * Elimina clasificación por liga y temporada (para actualizar)
     */
    void deleteByLeagueIdAndSeason(Integer leagueId, Integer season);
}
