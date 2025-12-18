package com.example.information.web;

import com.example.information.model.MiembroDTO;
import com.example.information.service.MiembroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/miembros")
@RequiredArgsConstructor
public class MiembroController {

    private final MiembroService miembroService;

    @GetMapping
    public ResponseEntity<List<MiembroDTO>> getAllMiembros() {
        List<MiembroDTO> miembros = miembroService.findAll();
        return ResponseEntity.ok(miembros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MiembroDTO> getMiembroById(@PathVariable Long id) {
        MiembroDTO miembro = miembroService.findById(id);
        return ResponseEntity.ok(miembro);
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<MiembroDTO> getMiembroByNombre(@PathVariable String nombre) {
        MiembroDTO miembro = miembroService.findByNombre(nombre);
        return ResponseEntity.ok(miembro);
    }

    @GetMapping("/nacionalidad/{nacionalidad}")
    public ResponseEntity<List<MiembroDTO>> getMiembrosByNacionalidad(@PathVariable String nacionalidad) {
        List<MiembroDTO> miembros = miembroService.findByNacionalidad(nacionalidad);
        return ResponseEntity.ok(miembros);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MiembroDTO>> searchMiembrosByNombre(@RequestParam String keyword) {
        List<MiembroDTO> miembros = miembroService.searchByNombre(keyword);
        return ResponseEntity.ok(miembros);
    }

    @GetMapping("/rango-fecha")
    public ResponseEntity<List<MiembroDTO>> getMiembrosByRangoFecha(
            @RequestParam int anioInicio,
            @RequestParam int anioFin) {
        List<MiembroDTO> miembros = miembroService.findByRangoFechaNacimiento(anioInicio, anioFin);
        return ResponseEntity.ok(miembros);
    }

    @GetMapping("/jugadores")
    public ResponseEntity<List<MiembroDTO>> getJugadores() {
        List<MiembroDTO> jugadores = miembroService.findJugadores();
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/entrenadores")
    public ResponseEntity<List<MiembroDTO>> getEntrenadores() {
        List<MiembroDTO> entrenadores = miembroService.findEntrenadores();
        return ResponseEntity.ok(entrenadores);
    }

    @GetMapping("/count/nacionalidad/{nacionalidad}")
    public ResponseEntity<Long> countByNacionalidad(@PathVariable String nacionalidad) {
        long count = miembroService.countByNacionalidad(nacionalidad);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMiembro(@PathVariable Long id) {
        miembroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
