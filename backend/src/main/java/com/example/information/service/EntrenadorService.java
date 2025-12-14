package com.example.information.service;

import com.example.information.entities.Entrenador;
import com.example.information.entities.Equipo;
import com.example.information.exception.InvalidOperationException;
import com.example.information.exception.ResourceNotFoundException;
import com.example.information.model.EntrenadorDTO;
import com.example.information.repositories.EntrenadorRepository;
import com.example.information.repositories.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntrenadorService {

    private final EntrenadorRepository entrenadorRepository;
    private final EquipoRepository equipoRepository;

    public List<EntrenadorDTO> findAll() {
        return entrenadorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EntrenadorDTO findById(Long id) {
        Entrenador entrenador = entrenadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", id));
        return convertToDTO(entrenador);
    }

    public EntrenadorDTO findByNombre(String nombre) {
        Entrenador entrenador = entrenadorRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "nombre", nombre));
        return convertToDTO(entrenador);
    }

    public List<EntrenadorDTO> findByNacionalidad(String nacionalidad) {
        return entrenadorRepository.findByNacionalidad(nacionalidad).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EntrenadorDTO> searchByNombre(String keyword) {
        return entrenadorRepository.searchByNombre(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EntrenadorDTO> findByMinExperiencia(int minAños) {
        return entrenadorRepository.findByMinExperiencia(minAños).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EntrenadorDTO> findTopByTitulos() {
        return entrenadorRepository.findTopByTitulos().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EntrenadorDTO> findEntrenadoresSinEquipo() {
        return entrenadorRepository.findEntrenadoresSinEquipo().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EntrenadorDTO> findEntrenadoresConEquipo() {
        return entrenadorRepository.findEntrenadoresConEquipo().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EntrenadorDTO create(EntrenadorDTO entrenadorDTO) {
        Entrenador entrenador = new Entrenador();
        entrenador.setNombre(entrenadorDTO.getNombre());
        entrenador.setFechaNacimiento(entrenadorDTO.getFechaNacimiento());
        entrenador.setNacionalidad(entrenadorDTO.getNacionalidad());
        entrenador.setAñosExperiencia(entrenadorDTO.getAñosExperiencia());
        entrenador.setTitulosGanados(entrenadorDTO.getTitulosGanados());

        // Asignar equipo si se proporciona
        if (entrenadorDTO.getEquipoId() != null) {
            Equipo equipo = equipoRepository.findById(entrenadorDTO.getEquipoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", entrenadorDTO.getEquipoId()));

            if (equipo.getEntrenador() != null) {
                throw new InvalidOperationException("asignar equipo",
                        "El equipo ya tiene un entrenador asignado");
            }
            entrenador.setEquipo(equipo);
        }

        Entrenador savedEntrenador = entrenadorRepository.save(entrenador);
        return convertToDTO(savedEntrenador);
    }

    public EntrenadorDTO update(Long id, EntrenadorDTO entrenadorDTO) {
        Entrenador existingEntrenador = entrenadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", id));

        existingEntrenador.setNombre(entrenadorDTO.getNombre());
        existingEntrenador.setFechaNacimiento(entrenadorDTO.getFechaNacimiento());
        existingEntrenador.setNacionalidad(entrenadorDTO.getNacionalidad());
        existingEntrenador.setAñosExperiencia(entrenadorDTO.getAñosExperiencia());
        existingEntrenador.setTitulosGanados(entrenadorDTO.getTitulosGanados());

        Entrenador updatedEntrenador = entrenadorRepository.save(existingEntrenador);
        return convertToDTO(updatedEntrenador);
    }

    public EntrenadorDTO asignarEquipo(Long entrenadorId, Long equipoId) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", entrenadorId));

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", equipoId));

        // Verificar que el equipo no tenga ya un entrenador diferente
        if (equipo.getEntrenador() != null && !equipo.getEntrenador().getId().equals(entrenadorId)) {
            throw new InvalidOperationException("asignar equipo",
                    "El equipo ya tiene un entrenador asignado");
        }

        // Liberar el equipo anterior si existe
        if (entrenador.getEquipo() != null) {
            entrenador.getEquipo().setEntrenador(null);
        }

        entrenador.setEquipo(equipo);
        equipo.setEntrenador(entrenador);

        Entrenador updatedEntrenador = entrenadorRepository.save(entrenador);
        return convertToDTO(updatedEntrenador);
    }

    public EntrenadorDTO liberarEquipo(Long entrenadorId) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", entrenadorId));

        if (entrenador.getEquipo() == null) {
            throw new InvalidOperationException("liberar equipo",
                    "El entrenador no tiene un equipo asignado");
        }

        entrenador.getEquipo().setEntrenador(null);
        entrenador.setEquipo(null);

        Entrenador updatedEntrenador = entrenadorRepository.save(entrenador);
        return convertToDTO(updatedEntrenador);
    }

    public EntrenadorDTO registrarTitulo(Long entrenadorId) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", entrenadorId));

        entrenador.setTitulosGanados(entrenador.getTitulosGanados() + 1);
        Entrenador updatedEntrenador = entrenadorRepository.save(entrenador);
        return convertToDTO(updatedEntrenador);
    }

    public void delete(Long id) {
        Entrenador entrenador = entrenadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador", "id", id));

        // Liberar el equipo antes de eliminar
        if (entrenador.getEquipo() != null) {
            entrenador.getEquipo().setEntrenador(null);
        }

        entrenadorRepository.deleteById(id);
    }

    private EntrenadorDTO convertToDTO(Entrenador entrenador) {
        return EntrenadorDTO.builder()
                .id(entrenador.getId())
                .nombre(entrenador.getNombre())
                .fechaNacimiento(entrenador.getFechaNacimiento())
                .nacionalidad(entrenador.getNacionalidad())
                .añosExperiencia(entrenador.getAñosExperiencia())
                .titulosGanados(entrenador.getTitulosGanados())
                .equipoId(entrenador.getEquipo() != null ? entrenador.getEquipo().getId() : null)
                .equipoNombre(entrenador.getEquipo() != null ? entrenador.getEquipo().getNombre() : null)
                .build();
    }
}
