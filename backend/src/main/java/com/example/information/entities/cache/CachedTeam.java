package com.example.information.entities.cache;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad para cachear equipos de la API-Football en la base de datos.
 * Almacena los datos del equipo para evitar consultas repetidas a la API.
 */
@Entity
@Table(name = "cached_teams", indexes = {
    @Index(name = "idx_cached_team_api_id", columnList = "apiId"),
    @Index(name = "idx_cached_team_name", columnList = "name"),
    @Index(name = "idx_cached_team_country", columnList = "country"),
    @Index(name = "idx_cached_team_league", columnList = "leagueId, season")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedTeam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** ID del equipo en API-Football */
    @Column(nullable = false)
    private Integer apiId;
    
    /** Nombre del equipo */
    @Column(nullable = false)
    private String name;
    
    /** Código corto del equipo */
    private String code;
    
    /** País del equipo */
    private String country;
    
    /** Año de fundación */
    private Integer founded;
    
    /** Si es equipo nacional */
    private Boolean national;
    
    /** URL del logo */
    @Column(length = 500)
    private String logo;
    
    // Datos del estadio
    private Integer venueId;
    private String venueName;
    private String venueAddress;
    private String venueCity;
    private Integer venueCapacity;
    private String venueSurface;
    
    @Column(length = 500)
    private String venueImage;
    
    /** ID de la liga (para equipos obtenidos por liga) */
    private Integer leagueId;
    
    /** Temporada (para equipos obtenidos por liga) */
    private Integer season;
    
    /** JSON completo de la respuesta */
    @Column(columnDefinition = "TEXT")
    private String rawJson;
    
    /** Fecha de creación del registro */
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    /** Fecha de última actualización */
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
