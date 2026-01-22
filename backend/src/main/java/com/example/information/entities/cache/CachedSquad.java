package com.example.information.entities.cache;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad para cachear plantillas de equipos de la API-Football.
 */
@Entity
@Table(name = "cached_squads", indexes = {
    @Index(name = "idx_cached_squad_team", columnList = "teamId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedSquad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** ID del equipo en API-Football */
    @Column(nullable = false, unique = true)
    private Integer teamId;
    
    /** JSON completo de la plantilla */
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
