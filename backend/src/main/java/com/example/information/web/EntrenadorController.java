package com.example.information.web;

import com.example.information.model.EntrenadorDTO;
import com.example.information.service.EntrenadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entrenadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EntrenadorController {

    private final EntrenadorService entrenadorService;

    @GetMapping
    public ResponseEntity<List<EntrenadorDTO>> getAllEntrenadores() {
        List<EntrenadorDTO> entrenadores = entrenadorService.findAll();
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrenadorDTO> getEntrenadorById(@PathVariable Long id) {
        EntrenadorDTO entrenador = entrenadorService.findById(id);
        return ResponseEntity.ok(entrenador);
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<EntrenadorDTO> getEntrenadorByNombre(@PathVariable String nombre) {
        EntrenadorDTO entrenador = entrenadorService.findByNombre(nombre);
        return ResponseEntity.ok(entrenador);
    }

    @GetMapping("/nacionalidad/{nacionalidad}")
    public ResponseEntity<List<EntrenadorDTO>> getEntrenadoresByNacionalidad(@PathVariable String nacionalidad) {
        List<EntrenadorDTO> entrenadores = entrenadorService.findByNacionalidad(nacionalidad);
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EntrenadorDTO>> searchEntrenadores(@RequestParam String keyword) {
        List<EntrenadorDTO> entrenadores = entrenadorService.searchByNombre(keyword);
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/experiencia")
    public ResponseEntity<List<EntrenadorDTO>> getEntrenadoresByExperiencia(@RequestParam int minAños) {
        List<EntrenadorDTO> entrenadores = entrenadorService.findByMinExperiencia(minAños);
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/top-titulos")
    public ResponseEntity<List<EntrenadorDTO>> getTopEntrenadoresByTitulos() {
        List<EntrenadorDTO> entrenadores = entrenadorService.findTopByTitulos();
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/sin-equipo")
    public ResponseEntity<List<EntrenadorDTO>> getEntrenadoresSinEquipo() {
        List<EntrenadorDTO> entrenadores = entrenadorService.findEntrenadoresSinEquipo();
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/con-equipo")
    public ResponseEntity<List<EntrenadorDTO>> getEntrenadoresConEquipo() {
        List<EntrenadorDTO> entrenadores = entrenadorService.findEntrenadoresConEquipo();
        return ResponseEntity.ok(entrenadores);
    }

    @PostMapping
    public ResponseEntity<EntrenadorDTO> createEntrenador(@Valid @RequestBody EntrenadorDTO entrenadorDTO) {
        EntrenadorDTO createdEntrenador = entrenadorService.create(entrenadorDTO);
        return new ResponseEntity<>(createdEntrenador, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrenadorDTO> updateEntrenador(@PathVariable Long id,
            @Valid @RequestBody EntrenadorDTO entrenadorDTO) {
        EntrenadorDTO updatedEntrenador = entrenadorService.update(id, entrenadorDTO);
        return ResponseEntity.ok(updatedEntrenador);
    }

    @PatchMapping("/{id}/equipo/{equipoId}")
    public ResponseEntity<EntrenadorDTO> asignarEquipo(@PathVariable Long id,
            @PathVariable Long equipoId) {
        EntrenadorDTO updatedEntrenador = entrenadorService.asignarEquipo(id, equipoId);
        return ResponseEntity.ok(updatedEntrenador);
    }

    @PatchMapping("/{id}/liberar-equipo")
    public ResponseEntity<EntrenadorDTO> liberarEquipo(@PathVariable Long id) {
        EntrenadorDTO updatedEntrenador = entrenadorService.liberarEquipo(id);
        return ResponseEntity.ok(updatedEntrenador);
    }

    @PatchMapping("/{id}/titulo")
    public ResponseEntity<EntrenadorDTO> registrarTitulo(@PathVariable Long id) {
        EntrenadorDTO updatedEntrenador = entrenadorService.registrarTitulo(id);
        return ResponseEntity.ok(updatedEntrenador);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntrenador(@PathVariable Long id) {
        entrenadorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
