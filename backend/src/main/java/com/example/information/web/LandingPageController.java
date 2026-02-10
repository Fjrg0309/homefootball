package com.example.information.web;

import com.example.information.model.LandingPageDTO;
import com.example.information.service.LandingPageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el endpoint de la Landing Page.
 * 
 * Este controlador proporciona datos para la página principal de la aplicación:
 * - Cantidad de usuarios registrados
 * - Lista de usuarios (información pública)
 * - Información de equipo destacado con escudo
 * 
 * SEGURIDAD: El endpoint principal está protegido con JWT.
 * Solo usuarios autenticados pueden acceder a los datos completos.
 * 
 * Arquitectura: 
 * - Capa de Controlador (expone la API REST)
 * - Delega la lógica de negocio al LandingPageService
 * 
 * @author DWES - Prueba Práctica
 * @version 1.0
 */
@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Tag(name = "Landing Page", description = "Endpoints para obtener datos de la página principal")
public class LandingPageController {

    private final LandingPageService landingPageService;
    
    /**
     * Obtiene los datos completos de la landing page.
     * 
     * REQUIERE AUTENTICACIÓN JWT.
     * 
     * Retorna:
     * - Total de usuarios registrados
     * - Lista de usuarios con información pública (sin datos sensibles)
     * - Equipo destacado (Real Madrid) con su escudo
     * - Mensaje de bienvenida personalizado
     * 
     * @return ResponseEntity con LandingPageDTO
     */
    @GetMapping
    @Operation(
        summary = "Obtener datos de la landing page",
        description = "Retorna información para la página principal incluyendo usuarios registrados y equipo destacado. Requiere autenticación JWT.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Datos obtenidos correctamente",
            content = @Content(schema = @Schema(implementation = LandingPageDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "No autorizado - Token JWT inválido o ausente",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Prohibido - No tiene permisos para acceder",
            content = @Content
        )
    })
    public ResponseEntity<LandingPageDTO> getLandingPageData() {
        LandingPageDTO data = landingPageService.getLandingPageData();
        return ResponseEntity.ok(data);
    }
    
    /**
     * Obtiene un resumen de la landing page.
     * 
     * REQUIERE AUTENTICACIÓN JWT.
     * 
     * Versión simplificada que incluye:
     * - Total de usuarios (solo el número)
     * - Equipo destacado
     * - Mensaje de bienvenida
     * 
     * NO incluye la lista completa de usuarios.
     * 
     * @return ResponseEntity con LandingPageDTO resumido
     */
    @GetMapping("/summary")
    @Operation(
        summary = "Obtener resumen de la landing page",
        description = "Retorna un resumen con el conteo de usuarios y equipo destacado. Requiere autenticación JWT.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Resumen obtenido correctamente",
            content = @Content(schema = @Schema(implementation = LandingPageDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "No autorizado - Token JWT inválido o ausente",
            content = @Content
        )
    })
    public ResponseEntity<LandingPageDTO> getLandingPageSummary() {
        LandingPageDTO summary = landingPageService.getLandingPageSummary();
        return ResponseEntity.ok(summary);
    }
}
