package com.example.information.repositories;

import com.example.information.entities.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    Optional<Equipo> findByNombre(String nombre);

    List<Equipo> findByLigaId(Long ligaId);

    List<Equipo> findByLigaNombre(String ligaNombre);

    boolean existsByNombre(String nombre);

    @Query("SELECT e FROM Equipo e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Equipo> searchByNombre(@Param("keyword") String keyword);

    @Query("SELECT e FROM Equipo e LEFT JOIN FETCH e.jugadores WHERE e.id = :id")
    Optional<Equipo> findByIdWithJugadores(@Param("id") Long id);

    @Query("SELECT e FROM Equipo e LEFT JOIN FETCH e.entrenador WHERE e.id = :id")
    Optional<Equipo> findByIdWithEntrenador(@Param("id") Long id);

    @Query("SELECT e FROM Equipo e WHERE e.liga.pais = :pais")
    List<Equipo> findByPais(@Param("pais") String pais);

    @Query("SELECT COUNT(j) FROM Jugador j WHERE j.equipo.id = :equipoId")
    int countJugadoresByEquipoId(@Param("equipoId") Long equipoId);
}
