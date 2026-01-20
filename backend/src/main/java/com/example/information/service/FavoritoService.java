package com.example.information.service;

import com.example.information.entities.Favorito;
import com.example.information.entities.Favorito.TipoFavorito;
import com.example.information.entities.Usuario;
import com.example.information.model.FavoritoDTO;
import com.example.information.model.FavoritoRequest;
import com.example.information.repositories.FavoritoRepository;
import com.example.information.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public List<FavoritoDTO> getFavoritosByUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<FavoritoDTO> getFavoritosByUsuarioAndTipo(Long usuarioId, String tipo) {
        TipoFavorito tipoFavorito = TipoFavorito.valueOf(tipo.toUpperCase());
        return favoritoRepository.findByUsuarioIdAndTipoOrderByFechaCreacionDesc(usuarioId, tipoFavorito)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public boolean isFavorito(Long usuarioId, String tipo, Long itemId) {
        TipoFavorito tipoFavorito = TipoFavorito.valueOf(tipo.toUpperCase());
        return favoritoRepository.existsByUsuarioIdAndTipoAndItemId(usuarioId, tipoFavorito, itemId);
    }

    @Transactional
    public FavoritoDTO addFavorito(Long usuarioId, FavoritoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TipoFavorito tipoFavorito = TipoFavorito.valueOf(request.getTipo().toUpperCase());

        // Verificar si ya existe
        if (favoritoRepository.existsByUsuarioIdAndTipoAndItemId(usuarioId, tipoFavorito, request.getItemId())) {
            throw new RuntimeException("El elemento ya está en favoritos");
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setTipo(tipoFavorito);
        favorito.setItemId(request.getItemId());
        favorito.setNombre(request.getNombre());
        favorito.setImagen(request.getImagen());
        favorito.setFechaCreacion(LocalDateTime.now());

        favorito = favoritoRepository.save(favorito);

        return toDTO(favorito);
    }

    @Transactional
    public boolean removeFavorito(Long usuarioId, String tipo, Long itemId) {
        TipoFavorito tipoFavorito = TipoFavorito.valueOf(tipo.toUpperCase());
        
        return favoritoRepository.findByUsuarioIdAndTipoAndItemId(usuarioId, tipoFavorito, itemId)
                .map(favorito -> {
                    favoritoRepository.delete(favorito);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public FavoritoDTO toggleFavorito(Long usuarioId, FavoritoRequest request) {
        TipoFavorito tipoFavorito = TipoFavorito.valueOf(request.getTipo().toUpperCase());
        
        return favoritoRepository.findByUsuarioIdAndTipoAndItemId(usuarioId, tipoFavorito, request.getItemId())
                .map(favorito -> {
                    favoritoRepository.delete(favorito);
                    return (FavoritoDTO) null; // Eliminado
                })
                .orElseGet(() -> addFavorito(usuarioId, request)); // Añadido
    }

    private FavoritoDTO toDTO(Favorito favorito) {
        return new FavoritoDTO(
            favorito.getId(),
            favorito.getUsuario().getId(),
            favorito.getTipo().name(),
            favorito.getItemId(),
            favorito.getNombre(),
            favorito.getImagen(),
            favorito.getFechaCreacion().format(FORMATTER)
        );
    }
}
