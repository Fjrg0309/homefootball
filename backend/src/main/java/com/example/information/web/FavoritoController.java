package com.example.information.web;

import com.example.information.model.FavoritoDTO;
import com.example.information.model.FavoritoRequest;
import com.example.information.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FavoritoDTO>> getFavoritosByUsuario(@PathVariable Long usuarioId) {
        List<FavoritoDTO> favoritos = favoritoService.getFavoritosByUsuario(usuarioId);
        return ResponseEntity.ok(favoritos);
    }

    @GetMapping("/usuario/{usuarioId}/tipo/{tipo}")
    public ResponseEntity<List<FavoritoDTO>> getFavoritosByUsuarioAndTipo(
            @PathVariable Long usuarioId,
            @PathVariable String tipo) {
        List<FavoritoDTO> favoritos = favoritoService.getFavoritosByUsuarioAndTipo(usuarioId, tipo);
        return ResponseEntity.ok(favoritos);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorito(
            @RequestParam Long usuarioId,
            @RequestParam String tipo,
            @RequestParam Long itemId) {
        boolean isFavorito = favoritoService.isFavorito(usuarioId, tipo, itemId);
        return ResponseEntity.ok(Map.of("isFavorito", isFavorito));
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> addFavorito(
            @PathVariable Long usuarioId,
            @RequestBody FavoritoRequest request) {
        try {
            FavoritoDTO favorito = favoritoService.addFavorito(usuarioId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(favorito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/usuario/{usuarioId}")
    public ResponseEntity<Map<String, Boolean>> removeFavorito(
            @PathVariable Long usuarioId,
            @RequestParam String tipo,
            @RequestParam Long itemId) {
        boolean removed = favoritoService.removeFavorito(usuarioId, tipo, itemId);
        return ResponseEntity.ok(Map.of("removed", removed));
    }

    @PostMapping("/usuario/{usuarioId}/toggle")
    public ResponseEntity<?> toggleFavorito(
            @PathVariable Long usuarioId,
            @RequestBody FavoritoRequest request) {
        try {
            FavoritoDTO favorito = favoritoService.toggleFavorito(usuarioId, request);
            if (favorito == null) {
                return ResponseEntity.ok(Map.of("action", "removed", "isFavorito", false));
            }
            return ResponseEntity.ok(Map.of("action", "added", "isFavorito", true, "favorito", favorito));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
