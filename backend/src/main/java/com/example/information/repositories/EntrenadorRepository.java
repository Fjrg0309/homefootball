package com.example.information.repositories;

import com.example.information.entities.Entrenador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntrenadorRepository extends JpaRepository<Entrenador, Long> {

    Optional<Entrenador> findByNombre(String nombre);

    List<Entrenador> findByNacionalidad(String nacionalidad);

    @Query("SELECT e FROM Entrenador e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Entrenador> searchByNombre(@Param("keyword") String keyword);

    @Query("SELECT e FROM Entrenador e WHERE e.añosExperiencia >= :minAños")
    List<Entrenador> findByMinExperiencia(@Param("minAños") int minAños);

    @Query("SELECT e FROM Entrenador e ORDER BY e.titulosGanados DESC")
    List<Entrenador> findTopByTitulos();

    @Query("SELECT e FROM Entrenador e WHERE e.titulosGanados >= :minTitulos")
    List<Entrenador> findByMinTitulos(@Param("minTitulos") int minTitulos);

    @Query("SELECT e FROM Entrenador e WHERE e.equipo IS NULL")
    List<Entrenador> findEntrenadoresSinEquipo();

    @Query("SELECT e FROM Entrenador e WHERE e.equipo IS NOT NULL")
    List<Entrenador> findEntrenadoresConEquipo();

    @Query("SELECT e FROM Entrenador e LEFT JOIN FETCH e.equipo WHERE e.id = :id")
    Optional<Entrenador> findByIdWithEquipo(@Param("id") Long id);
}
