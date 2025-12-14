package com.example.information.service;

import com.example.information.entities.Entrenador;
import com.example.information.entities.Equipo;
import com.example.information.entities.Liga;
import com.example.information.exception.DuplicateResourceException;
import com.example.information.exception.InvalidOperationException;
import com.example.information.exception.ResourceNotFoundException;
import com.example.information.model.EquipoDTO;
import com.example.information.repositories.EntrenadorRepository;
import com.example.information.repositories.EquipoRepository;
import com.example.information.repositories.LigaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final LigaRepository ligaRepository;
    private final EntrenadorRepository entrenadorRepository;

    public List<EquipoDTO> findAll() {
        return equipoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EquipoDTO findById(Long id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", id));
        return convertToDTO(equipo);
    }

    public EquipoDTO findByNombre(String nombre) {
        Equipo equipo = equipoRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "nombre", nombre));
        return convertToDTO(equipo);
    }

    public List<EquipoDTO> findByLigaId(Long ligaId) {
        if (!ligaRepository.existsById(ligaId)) {
            throw new ResourceNotFoundException("Liga", "id", ligaId);
        }
        return equipoRepository.findByLigaId(ligaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EquipoDTO> searchByNombre(String keyword) {
        return equipoRepository.searchByNombre(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EquipoDTO> findByPais(String pais) {
        return equipoRepository.findByPais(pais).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EquipoDTO findByIdWithJugadores(Long id) {
        Equipo equipo = equipoRepository.findByIdWithJugadores(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", id));
        return convertToDTOWithDetails(equipo);
    }

    public EquipoDTO create(EquipoDTO equipoDTO) {
        if (equipoRepository.existsByNombre(equipoDTO.getNombre())) {
            throw new DuplicateResourceException("Equipo", "nombre", equipoDTO.getNombre());
        }

        Liga liga = ligaRepository.findById(equipoDTO.getLigaId())
                .orElseThrow(() -> new ResourceNotFoundException("Liga", "id", equipoDTO.getLigaId()));

        Equipo equipo = new Equipo();
        equipo.setNombre(equipoDTO.getNombre());
        equipo.setFechaFundacion(equipoDTO.getFechaFundacion());
        equipo.setLiga(liga);

        // Asignar entrenador si se proporciona
        if (equipoDTO.getEntrenadorId() != null) {
            Entrenador entrenador = entrenadorRepository.findById(equipoDTO.getEntrenadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", equipoDTO.getEntrenadorId()));

            if (entrenador.getEquipo() != null) {
                throw new InvalidOperationException("asignar entrenador",
                        "El entrenador ya está asignado a otro equipo");
            }
            equipo.setEntrenador(entrenador);
        }

        Equipo savedEquipo = equipoRepository.save(equipo);
        return convertToDTO(savedEquipo);
    }

    public EquipoDTO update(Long id, EquipoDTO equipoDTO) {
        Equipo existingEquipo = equipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", id));

        // Verificar nombre duplicado
        if (!existingEquipo.getNombre().equals(equipoDTO.getNombre())
                && equipoRepository.existsByNombre(equipoDTO.getNombre())) {
            throw new DuplicateResourceException("Equipo", "nombre", equipoDTO.getNombre());
        }

        existingEquipo.setNombre(equipoDTO.getNombre());
        existingEquipo.setFechaFundacion(equipoDTO.getFechaFundacion());

        // Cambiar liga si es necesario
        if (!existingEquipo.getLiga().getId().equals(equipoDTO.getLigaId())) {
            Liga nuevaLiga = ligaRepository.findById(equipoDTO.getLigaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Liga", "id", equipoDTO.getLigaId()));
            existingEquipo.setLiga(nuevaLiga);
        }

        Equipo updatedEquipo = equipoRepository.save(existingEquipo);
        return convertToDTO(updatedEquipo);
    }

    public EquipoDTO asignarEntrenador(Long equipoId, Long entrenadorId) {
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", equipoId));

        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", entrenadorId));

        if (entrenador.getEquipo() != null && !entrenador.getEquipo().getId().equals(equipoId)) {
            throw new InvalidOperationException("asignar entrenador",
                    "El entrenador ya está asignado a otro equipo");
        }

        equipo.setEntrenador(entrenador);
        Equipo updatedEquipo = equipoRepository.save(equipo);
        return convertToDTO(updatedEquipo);
    }

    public void delete(Long id) {
        if (!equipoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipo", "id", id);
        }
        equipoRepository.deleteById(id);
    }

    public int getTotalGolesByEquipo(Long equipoId) {
        if (!equipoRepository.existsById(equipoId)) {
            throw new ResourceNotFoundException("Equipo", "id", equipoId);
        }
        Integer total = equipoRepository.countJugadoresByEquipoId(equipoId);
        return total != null ? total : 0;
    }

    private EquipoDTO convertToDTO(Equipo equipo) {
        return EquipoDTO.builder()
                .id(equipo.getId())
                .nombre(equipo.getNombre())
                .fechaFundacion(equipo.getFechaFundacion())
                .ligaId(equipo.getLiga().getId())
                .ligaNombre(equipo.getLiga().getNombre())
                .entrenadorId(equipo.getEntrenador() != null ? equipo.getEntrenador().getId() : null)
                .entrenadorNombre(equipo.getEntrenador() != null ? equipo.getEntrenador().getNombre() : null)
                .totalJugadores(equipo.getJugadores() != null ? equipo.getJugadores().size() : 0)
                .build();
    }

    private EquipoDTO convertToDTOWithDetails(Equipo equipo) {
        EquipoDTO dto = convertToDTO(equipo);
        // Los jugadores se cargarían aquí si fuera necesario
        return dto;
    }
}
