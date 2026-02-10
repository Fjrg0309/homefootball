package com.example.information.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para la respuesta del endpoint de la Landing Page.
 * Contiene información pública para mostrar en la página principal:
 * - Lista de usuarios registrados (información pública)
 * - Información de un equipo destacado (equipo grande)
 * - Estadísticas generales de la plataforma
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageDTO {
    
    /**
     * Número total de usuarios registrados en la plataforma
     */
    private long totalUsuarios;
    
    /**
     * Lista de usuarios registrados (información pública sin datos sensibles)
     */
    private List<UsuarioPublicoDTO> usuariosRegistrados;
    
    /**
     * Información del equipo destacado (equipo grande)
     */
    private EquipoDestacadoDTO equipoDestacado;
    
    /**
     * Mensaje de bienvenida personalizado
     */
    private String mensajeBienvenida;
    
    /**
     * DTO interno para información pública de usuarios
     * Solo expone datos no sensibles
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioPublicoDTO {
        private Long id;
        private String username;
        // No incluimos email ni otros datos sensibles
    }
    
    /**
     * DTO interno para información del equipo destacado
     * Incluye el escudo/logo del equipo
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipoDestacadoDTO {
        private Long id;
        private String nombre;
        private String fechaFundacion;
        private String ligaNombre;
        private String entrenadorNombre;
        private int totalJugadores;
        /**
         * URL del escudo del equipo
         * Para Real Madrid: https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg
         */
        private String escudoUrl;
    }
}
