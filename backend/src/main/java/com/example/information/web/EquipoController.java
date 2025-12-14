package com.example.information.web;

import com.example.information.model.EquipoDTO;
import com.example.information.service.EquipoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    @GetMapping
    public ResponseEntity<List<EquipoDTO>> getAllEquipos() {
        List<EquipoDTO> equipos = equipoService.findAll();
        return ResponseEntity.ok(equipos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO> getEquipoById(@PathVariable Long id) {
        EquipoDTO equipo = equipoService.findById(id);
        return ResponseEntity.ok(equipo);
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<EquipoDTO> getEquipoByNombre(@PathVariable String nombre) {
        EquipoDTO equipo = equipoService.findByNombre(nombre);
        return ResponseEntity.ok(equipo);
    }

    @GetMapping("/liga/{ligaId}")
    public ResponseEntity<List<EquipoDTO>> getEquiposByLiga(@PathVariable Long ligaId) {
        List<EquipoDTO> equipos = equipoService.findByLigaId(ligaId);
        return ResponseEntity.ok(equipos);
    }

    @GetMapping("/pais/{pais}")
    public ResponseEntity<List<EquipoDTO>> getEquiposByPais(@PathVariable String pais) {
        List<EquipoDTO> equipos = equipoService.findByPais(pais);
        return ResponseEntity.ok(equipos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EquipoDTO>> searchEquipos(@RequestParam String keyword) {
        List<EquipoDTO> equipos = equipoService.searchByNombre(keyword);
        return ResponseEntity.ok(equipos);
    }

    @GetMapping("/{id}/jugadores")
    public ResponseEntity<EquipoDTO> getEquipoWithJugadores(@PathVariable Long id) {
        EquipoDTO equipo = equipoService.findByIdWithJugadores(id);
        return ResponseEntity.ok(equipo);
    }

    @PostMapping
    public ResponseEntity<EquipoDTO> createEquipo(@Valid @RequestBody EquipoDTO equipoDTO) {
        EquipoDTO createdEquipo = equipoService.create(equipoDTO);
        return new ResponseEntity<>(createdEquipo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipoDTO> updateEquipo(@PathVariable Long id,
            @Valid @RequestBody EquipoDTO equipoDTO) {
        EquipoDTO updatedEquipo = equipoService.update(id, equipoDTO);
        return ResponseEntity.ok(updatedEquipo);
    }

    @PatchMapping("/{id}/entrenador/{entrenadorId}")
    public ResponseEntity<EquipoDTO> asignarEntrenador(@PathVariable Long id,
            @PathVariable Long entrenadorId) {
        EquipoDTO updatedEquipo = equipoService.asignarEntrenador(id, entrenadorId);
        return ResponseEntity.ok(updatedEquipo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipo(@PathVariable Long id) {
        equipoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
