package com.example.information.web;

import com.example.information.model.ComentarioDTO;
import com.example.information.service.ComentarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<ComentarioDTO>> getCommentsByMatch(
            @PathVariable Long matchId,
            @RequestParam(required = false) Long userId) {
        Long currentUserId = userId != null ? userId : 0L;
        List<ComentarioDTO> comentarios = comentarioService.findByMatchId(matchId, currentUserId);
        return ResponseEntity.ok(comentarios);
    }

    @PostMapping("/match/{matchId}")
    public ResponseEntity<ComentarioDTO> createComment(
            @PathVariable Long matchId,
            @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String texto = body.get("texto").toString();
        
        ComentarioDTO comentario = comentarioService.createComment(matchId, userId, texto);
        return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, Boolean>> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        boolean deleted = comentarioService.deleteComment(commentId, userId);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }
}
