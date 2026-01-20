package com.example.information.service;

import com.example.information.entities.Comentario;
import com.example.information.entities.Usuario;
import com.example.information.model.ComentarioDTO;
import com.example.information.repositories.ComentarioRepository;
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
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final UsuarioRepository usuarioRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public List<ComentarioDTO> findByMatchId(Long matchId, Long currentUserId) {
        List<Comentario> comentarios = comentarioRepository.findByMatchIdOrderByFechaCreacionAsc(matchId);
        return comentarios.stream()
                .map(c -> toDTO(c, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public ComentarioDTO createComment(Long matchId, Long usuarioId, String texto) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comentario comentario = new Comentario();
        comentario.setMatchId(matchId);
        comentario.setUsuario(usuario);
        comentario.setTexto(texto);
        comentario.setFechaCreacion(LocalDateTime.now());

        comentario = comentarioRepository.save(comentario);

        return toDTO(comentario, usuarioId);
    }

    @Transactional
    public boolean deleteComment(Long commentId, Long usuarioId) {
        return comentarioRepository.findById(commentId)
                .map(comentario -> {
                    if (comentario.getUsuario().getId().equals(usuarioId)) {
                        comentarioRepository.delete(comentario);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    private ComentarioDTO toDTO(Comentario comentario, Long currentUserId) {
        return new ComentarioDTO(
            comentario.getId(),
            comentario.getMatchId(),
            comentario.getUsuario().getId(),
            comentario.getUsuario().getUsername(),
            comentario.getTexto(),
            comentario.getFechaCreacion().format(FORMATTER),
            comentario.getUsuario().getId().equals(currentUserId)
        );
    }
}
