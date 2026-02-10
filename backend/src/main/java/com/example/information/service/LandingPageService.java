package com.example.information.service;

import com.example.information.entities.Equipo;
import com.example.information.entities.Usuario;
import com.example.information.model.LandingPageDTO;
import com.example.information.model.LandingPageDTO.EquipoDestacadoDTO;
import com.example.information.model.LandingPageDTO.UsuarioPublicoDTO;
import com.example.information.repositories.EquipoRepository;
import com.example.information.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para la Landing Page de la aplicación.
 * Proporciona datos públicos para mostrar en la página principal:
 * - Estadísticas de usuarios registrados
 * - Información de equipos destacados
 * 
 * Arquitectura: Capa de Servicio (entre Controlador y Repositorio)
 * Responsabilidad: Lógica de negocio para la landing page
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LandingPageService {

    private final UsuarioRepository usuarioRepository;
    private final EquipoRepository equipoRepository;
    
    /**
     * Mapa de URLs de escudos para equipos conocidos
     * En producción, esto podría venir de la base de datos o una API externa
     */
    private static final Map<String, String> ESCUDOS_EQUIPOS = Map.of(
        "Real Madrid", "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
        "FC Barcelona", "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
        "Manchester City", "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
        "Manchester United", "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        "Liverpool", "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
    );
    
    /**
     * Obtiene los datos completos para la landing page.
     * Este método es accesible solo para usuarios autenticados con JWT.
     * 
     * @return LandingPageDTO con toda la información necesaria
     */
    public LandingPageDTO getLandingPageData() {
        // Obtener todos los usuarios y crear DTOs públicos
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioPublicoDTO> usuariosPublicos = usuarios.stream()
                .filter(Usuario::isEnabled)
                .map(this::toUsuarioPublicoDTO)
                .collect(Collectors.toList());
        
        // Obtener el equipo destacado (por defecto Real Madrid, id=1)
        EquipoDestacadoDTO equipoDestacado = getEquipoDestacado();
        
        // Construir el DTO de respuesta
        return LandingPageDTO.builder()
                .totalUsuarios(usuariosPublicos.size())
                .usuariosRegistrados(usuariosPublicos)
                .equipoDestacado(equipoDestacado)
                .mensajeBienvenida("¡Bienvenido a HomeFootball! La mejor plataforma de información futbolística.")
                .build();
    }
    
    /**
     * Obtiene la información resumida de la landing page.
     * Versión simplificada con menos datos.
     * 
     * @return LandingPageDTO con información básica
     */
    public LandingPageDTO getLandingPageSummary() {
        long totalUsuarios = usuarioRepository.count();
        EquipoDestacadoDTO equipoDestacado = getEquipoDestacado();
        
        return LandingPageDTO.builder()
                .totalUsuarios(totalUsuarios)
                .usuariosRegistrados(null) // No incluimos la lista en el resumen
                .equipoDestacado(equipoDestacado)
                .mensajeBienvenida("¡Únete a los " + totalUsuarios + " usuarios de HomeFootball!")
                .build();
    }
    
    /**
     * Obtiene el equipo destacado para mostrar en la landing page.
     * Por defecto retorna Real Madrid como equipo grande.
     * 
     * @return EquipoDestacadoDTO con la información del equipo
     */
    private EquipoDestacadoDTO getEquipoDestacado() {
        // Intentar obtener Real Madrid (id=1) como equipo destacado
        Optional<Equipo> equipoOpt = equipoRepository.findByNombre("Real Madrid");
        
        // Si no existe, obtener el primer equipo disponible
        if (equipoOpt.isEmpty()) {
            List<Equipo> equipos = equipoRepository.findAll();
            if (!equipos.isEmpty()) {
                equipoOpt = Optional.of(equipos.get(0));
            }
        }
        
        return equipoOpt.map(this::toEquipoDestacadoDTO)
                .orElse(getEquipoDestacadoDefault());
    }
    
    /**
     * Convierte un Usuario a UsuarioPublicoDTO.
     * Solo incluye información no sensible.
     * 
     * @param usuario Usuario a convertir
     * @return UsuarioPublicoDTO con datos públicos
     */
    private UsuarioPublicoDTO toUsuarioPublicoDTO(Usuario usuario) {
        return UsuarioPublicoDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .build();
    }
    
    /**
     * Convierte un Equipo a EquipoDestacadoDTO.
     * Incluye el escudo del equipo si está disponible.
     * 
     * @param equipo Equipo a convertir
     * @return EquipoDestacadoDTO con toda la información
     */
    private EquipoDestacadoDTO toEquipoDestacadoDTO(Equipo equipo) {
        int totalJugadores = 0;
        if (equipo.getJugadores() != null) {
            totalJugadores = equipo.getJugadores().size();
        } else {
            totalJugadores = equipoRepository.countJugadoresByEquipoId(equipo.getId());
        }
        
        String escudoUrl = ESCUDOS_EQUIPOS.getOrDefault(
                equipo.getNombre(), 
                "https://via.placeholder.com/150?text=" + equipo.getNombre().replace(" ", "+")
        );
        
        return EquipoDestacadoDTO.builder()
                .id(equipo.getId())
                .nombre(equipo.getNombre())
                .fechaFundacion(equipo.getFechaFundacion())
                .ligaNombre(equipo.getLiga() != null ? equipo.getLiga().getNombre() : "Sin liga")
                .entrenadorNombre(equipo.getEntrenador() != null 
                        ? equipo.getEntrenador().getNombre() 
                        : "Sin entrenador")
                .totalJugadores(totalJugadores)
                .escudoUrl(escudoUrl)
                .build();
    }
    
    /**
     * Retorna un equipo destacado por defecto cuando no hay datos.
     * 
     * @return EquipoDestacadoDTO con valores por defecto
     */
    private EquipoDestacadoDTO getEquipoDestacadoDefault() {
        return EquipoDestacadoDTO.builder()
                .id(0L)
                .nombre("Equipo Destacado")
                .fechaFundacion("N/A")
                .ligaNombre("N/A")
                .entrenadorNombre("N/A")
                .totalJugadores(0)
                .escudoUrl("https://via.placeholder.com/150?text=Equipo")
                .build();
    }
}
