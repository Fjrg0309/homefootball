package com.example.information.entities.cache;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad para cachear clasificaciones de la API-Football en la base de datos.
 */
@Entity
@Table(name = "cached_standings", indexes = {
    @Index(name = "idx_cached_standings_league_season", columnList = "leagueId, season")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedStandings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** ID de la liga en API-Football */
    @Column(nullable = false)
    private Integer leagueId;
    
    /** Temporada */
    @Column(nullable = false)
    private Integer season;
    
    /** JSON completo de la clasificación */
    @Column(columnDefinition = "TEXT", nullable = false)
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
