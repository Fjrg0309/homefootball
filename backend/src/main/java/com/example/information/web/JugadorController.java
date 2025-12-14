package com.example.information.web;

import com.example.information.model.JugadorDTO;
import com.example.information.service.JugadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JugadorController {

    private final JugadorService jugadorService;

    @GetMapping
    public ResponseEntity<List<JugadorDTO>> getAllJugadores() {
        List<JugadorDTO> jugadores = jugadorService.findAll();
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JugadorDTO> getJugadorById(@PathVariable Long id) {
        JugadorDTO jugador = jugadorService.findById(id);
        return ResponseEntity.ok(jugador);
    }

    @GetMapping("/equipo/{equipoId}")
    public ResponseEntity<List<JugadorDTO>> getJugadoresByEquipo(@PathVariable Long equipoId) {
        List<JugadorDTO> jugadores = jugadorService.findByEquipoId(equipoId);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/liga/{ligaId}")
    public ResponseEntity<List<JugadorDTO>> getJugadoresByLiga(@PathVariable Long ligaId) {
        List<JugadorDTO> jugadores = jugadorService.findByLigaId(ligaId);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/posicion/{posicion}")
    public ResponseEntity<List<JugadorDTO>> getJugadoresByPosicion(@PathVariable String posicion) {
        List<JugadorDTO> jugadores = jugadorService.findByPosicion(posicion);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/nacionalidad/{nacionalidad}")
    public ResponseEntity<List<JugadorDTO>> getJugadoresByNacionalidad(@PathVariable String nacionalidad) {
        List<JugadorDTO> jugadores = jugadorService.findByNacionalidad(nacionalidad);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/search")
    public ResponseEntity<List<JugadorDTO>> searchJugadores(@RequestParam String keyword) {
        List<JugadorDTO> jugadores = jugadorService.searchByNombre(keyword);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/goleadores")
    public ResponseEntity<List<JugadorDTO>> getTopGoleadores() {
        List<JugadorDTO> goleadores = jugadorService.findTopGoleadores();
        return ResponseEntity.ok(goleadores);
    }

    @GetMapping("/goleadores/liga/{ligaId}")
    public ResponseEntity<List<JugadorDTO>> getTopGoleadoresByLiga(@PathVariable Long ligaId) {
        List<JugadorDTO> goleadores = jugadorService.findTopGoleadoresByLiga(ligaId);
        return ResponseEntity.ok(goleadores);
    }

    @PostMapping
    public ResponseEntity<JugadorDTO> createJugador(@Valid @RequestBody JugadorDTO jugadorDTO) {
        JugadorDTO createdJugador = jugadorService.create(jugadorDTO);
        return new ResponseEntity<>(createdJugador, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JugadorDTO> updateJugador(@PathVariable Long id,
            @Valid @RequestBody JugadorDTO jugadorDTO) {
        JugadorDTO updatedJugador = jugadorService.update(id, jugadorDTO);
        return ResponseEntity.ok(updatedJugador);
    }

    @PatchMapping("/{id}/transferir/{nuevoEquipoId}")
    public ResponseEntity<JugadorDTO> transferirJugador(@PathVariable Long id,
            @PathVariable Long nuevoEquipoId) {
        JugadorDTO updatedJugador = jugadorService.transferirJugador(id, nuevoEquipoId);
        return ResponseEntity.ok(updatedJugador);
    }

    @PatchMapping("/{id}/gol")
    public ResponseEntity<JugadorDTO> registrarGol(@PathVariable Long id) {
        JugadorDTO updatedJugador = jugadorService.registrarGol(id);
        return ResponseEntity.ok(updatedJugador);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJugador(@PathVariable Long id) {
        jugadorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
