package com.example.information.repositories.cache;

import com.example.information.entities.cache.CachedLeague;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para acceder a las ligas cacheadas en base de datos.
 */
@Repository
public interface CachedLeagueRepository extends JpaRepository<CachedLeague, Long> {
    
    /**
     * Busca una liga por su ID de API-Football
     */
    Optional<CachedLeague> findByApiId(Integer apiId);
    
    /**
     * Verifica si existe una liga por su ID de API
     */
    boolean existsByApiId(Integer apiId);
    
    /**
     * Busca ligas por país
     */
    List<CachedLeague> findByCountryNameIgnoreCase(String countryName);
    
    /**
     * Busca ligas cuyo nombre contiene el texto (case insensitive)
     */
    @Query("SELECT l FROM CachedLeague l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<CachedLeague> searchByName(@Param("search") String search);
    
    /**
     * Busca ligas por nombre o país
     */
    @Query("SELECT l FROM CachedLeague l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(l.countryName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<CachedLeague> searchByNameOrCountry(@Param("search") String search);
    
    /**
     * Obtiene todas las ligas ordenadas por nombre
     */
    List<CachedLeague> findAllByOrderByNameAsc();
    
    /**
     * Cuenta el número de ligas cacheadas
     */
    long count();
}
