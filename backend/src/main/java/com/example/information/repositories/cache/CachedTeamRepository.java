package com.example.information.repositories.cache;

import com.example.information.entities.cache.CachedTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para acceder a los equipos cacheados en base de datos.
 */
@Repository
public interface CachedTeamRepository extends JpaRepository<CachedTeam, Long> {
    
    /**
     * Busca un equipo por su ID de API-Football
     */
    Optional<CachedTeam> findFirstByApiId(Integer apiId);
    
    /**
     * Verifica si existe un equipo por su ID de API
     */
    boolean existsByApiId(Integer apiId);
    
    /**
     * Busca equipos por liga y temporada
     */
    List<CachedTeam> findByLeagueIdAndSeason(Integer leagueId, Integer season);
    
    /**
     * Verifica si existen equipos para una liga y temporada
     */
    boolean existsByLeagueIdAndSeason(Integer leagueId, Integer season);
    
    /**
     * Busca equipos cuyo nombre contiene el texto (case insensitive)
     */
    @Query("SELECT t FROM CachedTeam t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<CachedTeam> searchByName(@Param("search") String search);
    
    /**
     * Busca equipos por país
     */
    List<CachedTeam> findByCountryIgnoreCase(String country);
    
    /**
     * Obtiene todos los equipos ordenados por nombre
     */
    List<CachedTeam> findAllByOrderByNameAsc();
}
