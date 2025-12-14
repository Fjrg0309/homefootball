package com.example.information.service;

import com.example.information.entities.Equipo;
import com.example.information.entities.Jugador;
import com.example.information.exception.DuplicateResourceException;
import com.example.information.exception.InvalidOperationException;
import com.example.information.exception.ResourceNotFoundException;
import com.example.information.model.JugadorDTO;
import com.example.information.repositories.EquipoRepository;
import com.example.information.repositories.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final EquipoRepository equipoRepository;

    public List<JugadorDTO> findAll() {
        return jugadorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JugadorDTO findById(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador", "id", id));
        return convertToDTO(jugador);
    }

    public List<JugadorDTO> findByEquipoId(Long equipoId) {
        if (!equipoRepository.existsById(equipoId)) {
            throw new ResourceNotFoundException("Equipo", "id", equipoId);
        }
        return jugadorRepository.findByEquipoId(equipoId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> findByPosicion(String posicion) {
        return jugadorRepository.findByPosicion(posicion).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> findByNacionalidad(String nacionalidad) {
        return jugadorRepository.findByNacionalidad(nacionalidad).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> searchByNombre(String keyword) {
        return jugadorRepository.searchByNombre(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> findByLigaId(Long ligaId) {
        return jugadorRepository.findByLigaId(ligaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> findTopGoleadores() {
        return jugadorRepository.findTopGoleadores().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JugadorDTO> findTopGoleadoresByLiga(Long ligaId) {
        return jugadorRepository.findTopGoleadoresByLiga(ligaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JugadorDTO create(JugadorDTO jugadorDTO) {
        Equipo equipo = equipoRepository.findById(jugadorDTO.getEquipoId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", jugadorDTO.getEquipoId()));

        // Verificar que el número de camiseta no esté en uso en el mismo equipo
        if (jugadorRepository.existsByNumeroCamisetaAndEquipoId(
                jugadorDTO.getNumeroCamiseta(), jugadorDTO.getEquipoId())) {
            throw new DuplicateResourceException("Jugador", "numeroCamiseta",
                    jugadorDTO.getNumeroCamiseta() + " en equipo " + equipo.getNombre());
        }

        Jugador jugador = new Jugador();
        jugador.setNombre(jugadorDTO.getNombre());
        jugador.setFechaNacimiento(jugadorDTO.getFechaNacimiento());
        jugador.setNacionalidad(jugadorDTO.getNacionalidad());
        jugador.setPosicion(jugadorDTO.getPosicion());
        jugador.setNumeroCamiseta(jugadorDTO.getNumeroCamiseta());
        jugador.setGolesMarcados(jugadorDTO.getGolesMarcados());
        jugador.setEquipo(equipo);

        Jugador savedJugador = jugadorRepository.save(jugador);
        return convertToDTO(savedJugador);
    }

    public JugadorDTO update(Long id, JugadorDTO jugadorDTO) {
        Jugador existingJugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador", "id", id));

        // Verificar número de camiseta si cambia
        if (existingJugador.getNumeroCamiseta() != jugadorDTO.getNumeroCamiseta() ||
                !existingJugador.getEquipo().getId().equals(jugadorDTO.getEquipoId())) {

            if (jugadorRepository.existsByNumeroCamisetaAndEquipoId(
                    jugadorDTO.getNumeroCamiseta(), jugadorDTO.getEquipoId())) {
                throw new DuplicateResourceException("Jugador", "numeroCamiseta",
                        jugadorDTO.getNumeroCamiseta());
            }
        }

        existingJugador.setNombre(jugadorDTO.getNombre());
        existingJugador.setFechaNacimiento(jugadorDTO.getFechaNacimiento());
        existingJugador.setNacionalidad(jugadorDTO.getNacionalidad());
        existingJugador.setPosicion(jugadorDTO.getPosicion());
        existingJugador.setNumeroCamiseta(jugadorDTO.getNumeroCamiseta());
        existingJugador.setGolesMarcados(jugadorDTO.getGolesMarcados());

        // Cambiar equipo si es necesario
        if (!existingJugador.getEquipo().getId().equals(jugadorDTO.getEquipoId())) {
            Equipo nuevoEquipo = equipoRepository.findById(jugadorDTO.getEquipoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", jugadorDTO.getEquipoId()));
            existingJugador.setEquipo(nuevoEquipo);
        }

        Jugador updatedJugador = jugadorRepository.save(existingJugador);
        return convertToDTO(updatedJugador);
    }

    public JugadorDTO transferirJugador(Long jugadorId, Long nuevoEquipoId) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador", "id", jugadorId));

        Equipo nuevoEquipo = equipoRepository.findById(nuevoEquipoId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo", "id", nuevoEquipoId));

        // Verificar que el número de camiseta esté disponible en el nuevo equipo
        if (jugadorRepository.existsByNumeroCamisetaAndEquipoId(
                jugador.getNumeroCamiseta(), nuevoEquipoId)) {
            throw new InvalidOperationException("transferir jugador",
                    "El número de camiseta " + jugador.getNumeroCamiseta() +
                            " ya está en uso en el equipo " + nuevoEquipo.getNombre());
        }

        jugador.setEquipo(nuevoEquipo);
        Jugador updatedJugador = jugadorRepository.save(jugador);
        return convertToDTO(updatedJugador);
    }

    public JugadorDTO registrarGol(Long jugadorId) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador", "id", jugadorId));

        jugador.setGolesMarcados(jugador.getGolesMarcados() + 1);
        Jugador updatedJugador = jugadorRepository.save(jugador);
        return convertToDTO(updatedJugador);
    }

    public void delete(Long id) {
        if (!jugadorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Jugador", "id", id);
        }
        jugadorRepository.deleteById(id);
    }

    private JugadorDTO convertToDTO(Jugador jugador) {
        return JugadorDTO.builder()
                .id(jugador.getId())
                .nombre(jugador.getNombre())
                .fechaNacimiento(jugador.getFechaNacimiento())
                .nacionalidad(jugador.getNacionalidad())
                .posicion(jugador.getPosicion())
                .numeroCamiseta(jugador.getNumeroCamiseta())
                .golesMarcados(jugador.getGolesMarcados())
                .equipoId(jugador.getEquipo().getId())
                .equipoNombre(jugador.getEquipo().getNombre())
                .ligaNombre(jugador.getEquipo().getLiga().getNombre())
                .build();
    }
}
