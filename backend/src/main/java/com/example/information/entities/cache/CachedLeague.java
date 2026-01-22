package com.example.information.entities.cache;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad para cachear ligas de la API-Football en la base de datos.
 * Almacena los datos de la liga para evitar consultas repetidas a la API.
 */
@Entity
@Table(name = "cached_leagues", indexes = {
    @Index(name = "idx_cached_league_api_id", columnList = "apiId"),
    @Index(name = "idx_cached_league_name", columnList = "name"),
    @Index(name = "idx_cached_league_country", columnList = "countryName")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedLeague {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** ID de la liga en API-Football */
    @Column(nullable = false, unique = true)
    private Integer apiId;
    
    /** Nombre de la liga */
    @Column(nullable = false)
    private String name;
    
    /** Tipo de competición (League, Cup) */
    private String type;
    
    /** URL del logo */
    @Column(length = 500)
    private String logo;
    
    /** Nombre del país */
    private String countryName;
    
    /** Código del país */
    private String countryCode;
    
    /** URL de la bandera */
    @Column(length = 500)
    private String countryFlag;
    
    /** Temporada actual */
    private Integer currentSeason;
    
    /** JSON completo de la respuesta (para datos adicionales) */
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
