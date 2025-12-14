package com.example.information.web;

import com.example.information.model.LigaDTO;
import com.example.information.service.LigaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ligas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LigaController {

    private final LigaService ligaService;

    @GetMapping
    public ResponseEntity<List<LigaDTO>> getAllLigas() {
        List<LigaDTO> ligas = ligaService.findAll();
        return ResponseEntity.ok(ligas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigaDTO> getLigaById(@PathVariable Long id) {
        LigaDTO liga = ligaService.findById(id);
        return ResponseEntity.ok(liga);
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<LigaDTO> getLigaByNombre(@PathVariable String nombre) {
        LigaDTO liga = ligaService.findByNombre(nombre);
        return ResponseEntity.ok(liga);
    }

    @GetMapping("/pais/{pais}")
    public ResponseEntity<List<LigaDTO>> getLigasByPais(@PathVariable String pais) {
        List<LigaDTO> ligas = ligaService.findByPais(pais);
        return ResponseEntity.ok(ligas);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LigaDTO>> searchLigas(@RequestParam String keyword) {
        List<LigaDTO> ligas = ligaService.searchByNombre(keyword);
        return ResponseEntity.ok(ligas);
    }

    @GetMapping("/{id}/equipos")
    public ResponseEntity<LigaDTO> getLigaWithEquipos(@PathVariable Long id) {
        LigaDTO liga = ligaService.findByIdWithEquipos(id);
        return ResponseEntity.ok(liga);
    }

    @PostMapping
    public ResponseEntity<LigaDTO> createLiga(@Valid @RequestBody LigaDTO ligaDTO) {
        LigaDTO createdLiga = ligaService.create(ligaDTO);
        return new ResponseEntity<>(createdLiga, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LigaDTO> updateLiga(@PathVariable Long id,
            @Valid @RequestBody LigaDTO ligaDTO) {
        LigaDTO updatedLiga = ligaService.update(id, ligaDTO);
        return ResponseEntity.ok(updatedLiga);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLiga(@PathVariable Long id) {
        ligaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
