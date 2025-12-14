package com.example.information.repositories;

import com.example.information.entities.Liga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LigaRepository extends JpaRepository<Liga, Long> {

    Optional<Liga> findByNombre(String nombre);

    List<Liga> findByPais(String pais);

    List<Liga> findByTemporadaActual(String temporadaActual);

    boolean existsByNombre(String nombre);

    @Query("SELECT l FROM Liga l WHERE LOWER(l.nombre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Liga> searchByNombre(@Param("keyword") String keyword);

    @Query("SELECT l FROM Liga l LEFT JOIN FETCH l.equipos WHERE l.id = :id")
    Optional<Liga> findByIdWithEquipos(@Param("id") Long id);
}
