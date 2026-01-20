package com.example.information.repositories;

import com.example.information.entities.Favorito;
import com.example.information.entities.Favorito.TipoFavorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    
    List<Favorito> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    
    List<Favorito> findByUsuarioIdAndTipoOrderByFechaCreacionDesc(Long usuarioId, TipoFavorito tipo);
    
    Optional<Favorito> findByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);
    
    boolean existsByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);
    
    void deleteByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);
}
