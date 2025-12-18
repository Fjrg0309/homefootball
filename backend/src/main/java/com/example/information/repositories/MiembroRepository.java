package com.example.information.repositories;

import com.example.information.entities.Miembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MiembroRepository extends JpaRepository<Miembro, Long> {

    Optional<Miembro> findByNombre(String nombre);

    List<Miembro> findByNacionalidad(String nacionalidad);

    @Query("SELECT m FROM Miembro m WHERE LOWER(m.nombre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Miembro> searchByNombre(@Param("keyword") String keyword);

    @Query("SELECT m FROM Miembro m WHERE YEAR(CAST(m.fechaNacimiento AS date)) BETWEEN :anioInicio AND :anioFin")
    List<Miembro> findByRangoFechaNacimiento(@Param("anioInicio") int anioInicio, @Param("anioFin") int anioFin);

    @Query("SELECT m FROM Miembro m WHERE TYPE(m) = :tipo")
    List<Miembro> findByTipo(@Param("tipo") Class<? extends Miembro> tipo);

    @Query("SELECT COUNT(m) FROM Miembro m WHERE m.nacionalidad = :nacionalidad")
    long countByNacionalidad(@Param("nacionalidad") String nacionalidad);

    boolean existsByNombre(String nombre);
}
