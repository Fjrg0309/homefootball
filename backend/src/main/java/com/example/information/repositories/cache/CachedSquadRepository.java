package com.example.information.repositories.cache;

import com.example.information.entities.cache.CachedSquad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para acceder a las plantillas cacheadas en base de datos.
 */
@Repository
public interface CachedSquadRepository extends JpaRepository<CachedSquad, Long> {
    
    /**
     * Busca plantilla por ID de equipo
     */
    Optional<CachedSquad> findByTeamId(Integer teamId);
    
    /**
     * Verifica si existe plantilla para un equipo
     */
    boolean existsByTeamId(Integer teamId);
    
    /**
     * Elimina plantilla por ID de equipo (para actualizar)
     */
    void deleteByTeamId(Integer teamId);
}
