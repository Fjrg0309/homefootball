package com.example.information.service;

import com.example.information.entities.Entrenador;
import com.example.information.entities.Jugador;
import com.example.information.entities.Miembro;
import com.example.information.exception.ResourceNotFoundException;
import com.example.information.model.MiembroDTO;
import com.example.information.repositories.MiembroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MiembroService {

    private final MiembroRepository miembroRepository;

    public List<MiembroDTO> findAll() {
        return miembroRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MiembroDTO findById(Long id) {
        Miembro miembro = miembroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro", "id", id));
        return convertToDTO(miembro);
    }

    public MiembroDTO findByNombre(String nombre) {
        Miembro miembro = miembroRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro", "nombre", nombre));
        return convertToDTO(miembro);
    }

    public List<MiembroDTO> findByNacionalidad(String nacionalidad) {
        return miembroRepository.findByNacionalidad(nacionalidad).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MiembroDTO> searchByNombre(String keyword) {
        return miembroRepository.searchByNombre(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MiembroDTO> findByRangoFechaNacimiento(int añoInicio, int añoFin) {
        return miembroRepository.findByRangoFechaNacimiento(añoInicio, añoFin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MiembroDTO> findJugadores() {
        return miembroRepository.findByTipo(Jugador.class).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MiembroDTO> findEntrenadores() {
        return miembroRepository.findByTipo(Entrenador.class).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long countByNacionalidad(String nacionalidad) {
        return miembroRepository.countByNacionalidad(nacionalidad);
    }

    public void delete(Long id) {
        if (!miembroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Miembro", "id", id);
        }
        miembroRepository.deleteById(id);
    }

    private MiembroDTO convertToDTO(Miembro miembro) {
        String tipo = miembro instanceof Jugador ? "Jugador" : 
                     miembro instanceof Entrenador ? "Entrenador" : "Miembro";

        return MiembroDTO.builder()
                .id(miembro.getId())
                .nombre(miembro.getNombre())
                .fechaNacimiento(miembro.getFechaNacimiento())
                .nacionalidad(miembro.getNacionalidad())
                .tipo(tipo)
                .build();
    }
}
