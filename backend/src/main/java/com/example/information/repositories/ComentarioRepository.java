package com.example.information.repositories;

import com.example.information.entities.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    List<Comentario> findByMatchIdOrderByFechaCreacionAsc(Long matchId);
    
    List<Comentario> findByUsuarioId(Long usuarioId);
    
    void deleteByIdAndUsuarioId(Long id, Long usuarioId);
}
