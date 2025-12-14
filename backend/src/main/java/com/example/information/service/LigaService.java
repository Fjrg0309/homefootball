package com.example.information.service;

import com.example.information.entities.Liga;
import com.example.information.exception.DuplicateResourceException;
import com.example.information.exception.ResourceNotFoundException;
import com.example.information.model.LigaDTO;
import com.example.information.repositories.LigaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LigaService {

    private final LigaRepository ligaRepository;

    public List<LigaDTO> findAll() {
        return ligaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LigaDTO findById(Long id) {
        Liga liga = ligaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga", "id", id));
        return convertToDTO(liga);
    }

    public LigaDTO findByNombre(String nombre) {
        Liga liga = ligaRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Liga", "nombre", nombre));
        return convertToDTO(liga);
    }

    public List<LigaDTO> findByPais(String pais) {
        return ligaRepository.findByPais(pais).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LigaDTO> searchByNombre(String keyword) {
        return ligaRepository.searchByNombre(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LigaDTO findByIdWithEquipos(Long id) {
        Liga liga = ligaRepository.findByIdWithEquipos(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga", "id", id));
        return convertToDTOWithEquipos(liga);
    }

    public LigaDTO create(LigaDTO ligaDTO) {
        if (ligaRepository.existsByNombre(ligaDTO.getNombre())) {
            throw new DuplicateResourceException("Liga", "nombre", ligaDTO.getNombre());
        }

        Liga liga = convertToEntity(ligaDTO);
        Liga savedLiga = ligaRepository.save(liga);
        return convertToDTO(savedLiga);
    }

    public LigaDTO update(Long id, LigaDTO ligaDTO) {
        Liga existingLiga = ligaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga", "id", id));

        // Verificar si el nuevo nombre ya existe (excepto para la liga actual)
        if (!existingLiga.getNombre().equals(ligaDTO.getNombre())
                && ligaRepository.existsByNombre(ligaDTO.getNombre())) {
            throw new DuplicateResourceException("Liga", "nombre", ligaDTO.getNombre());
        }

        existingLiga.setNombre(ligaDTO.getNombre());
        existingLiga.setPais(ligaDTO.getPais());
        existingLiga.setTemporadaActual(ligaDTO.getTemporadaActual());

        Liga updatedLiga = ligaRepository.save(existingLiga);
        return convertToDTO(updatedLiga);
    }

    public void delete(Long id) {
        if (!ligaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Liga", "id", id);
        }
        ligaRepository.deleteById(id);
    }

    private LigaDTO convertToDTO(Liga liga) {
        return LigaDTO.builder()
                .id(liga.getId())
                .nombre(liga.getNombre())
                .pais(liga.getPais())
                .temporadaActual(liga.getTemporadaActual())
                .totalEquipos(liga.getEquipos() != null ? liga.getEquipos().size() : 0)
                .build();
    }

    private LigaDTO convertToDTOWithEquipos(Liga liga) {
        LigaDTO dto = convertToDTO(liga);
        // Los equipos se cargarían aquí si fuera necesario
        return dto;
    }

    private Liga convertToEntity(LigaDTO dto) {
        Liga liga = new Liga();
        liga.setNombre(dto.getNombre());
        liga.setPais(dto.getPais());
        liga.setTemporadaActual(dto.getTemporadaActual());
        return liga;
    }
}
