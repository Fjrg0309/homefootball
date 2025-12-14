package com.example.information.repositories;

import com.example.information.entities.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {

    List<Jugador> findByEquipoId(Long equipoId);

    List<Jugador> findByEquipoNombre(String equipoNombre);

    List<Jugador> findByPosicion(String posicion);

    List<Jugador> findByNacionalidad(String nacionalidad);

    Optional<Jugador> findByNumeroCamisetaAndEquipoId(int numeroCamiseta, Long equipoId);

    @Query("SELECT j FROM Jugador j WHERE LOWER(j.nombre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Jugador> searchByNombre(@Param("keyword") String keyword);

    @Query("SELECT j FROM Jugador j WHERE j.equipo.liga.id = :ligaId")
    List<Jugador> findByLigaId(@Param("ligaId") Long ligaId);

    @Query("SELECT j FROM Jugador j ORDER BY j.golesMarcados DESC")
    List<Jugador> findTopGoleadores();

    @Query("SELECT j FROM Jugador j WHERE j.equipo.liga.id = :ligaId ORDER BY j.golesMarcados DESC")
    List<Jugador> findTopGoleadoresByLiga(@Param("ligaId") Long ligaId);

    @Query("SELECT j FROM Jugador j WHERE j.golesMarcados >= :minGoles")
    List<Jugador> findByMinGoles(@Param("minGoles") int minGoles);

    boolean existsByNumeroCamisetaAndEquipoId(int numeroCamiseta, Long equipoId);

    @Query("SELECT SUM(j.golesMarcados) FROM Jugador j WHERE j.equipo.id = :equipoId")
    Integer getTotalGolesByEquipo(@Param("equipoId") Long equipoId);
}
