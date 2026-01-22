package com.example.information.entities.cache;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad para cachear jugadores de la API-Football en la base de datos.
 * Almacena los datos del jugador para evitar consultas repetidas a la API.
 */
@Entity
@Table(name = "cached_players", indexes = {
    @Index(name = "idx_cached_player_api_id", columnList = "apiId"),
    @Index(name = "idx_cached_player_name", columnList = "name"),
    @Index(name = "idx_cached_player_team", columnList = "teamId, season"),
    @Index(name = "idx_cached_player_search", columnList = "searchKey")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedPlayer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** ID del jugador en API-Football */
    @Column(nullable = false)
    private Integer apiId;
    
    /** Nombre completo del jugador */
    @Column(nullable = false)
    private String name;
    
    /** Nombre */
    private String firstname;
    
    /** Apellido */
    private String lastname;
    
    /** Edad */
    private Integer age;
    
    /** Fecha de nacimiento */
    private String birthDate;
    
    /** Lugar de nacimiento */
    private String birthPlace;
    
    /** País de nacimiento */
    private String birthCountry;
    
    /** Nacionalidad */
    private String nationality;
    
    /** Altura */
    private String height;
    
    /** Peso */
    private String weight;
    
    /** URL de la foto */
    @Column(length = 500)
    private String photo;
    
    /** Si está lesionado */
    private Boolean injured;
    
    // Datos del equipo actual
    private Integer teamId;
    private String teamName;
    
    @Column(length = 500)
    private String teamLogo;
    
    // Datos de la liga
    private Integer leagueId;
    private String leagueName;
    
    /** Temporada */
    private Integer season;
    
    /** Posición */
    private String position;
    
    /** Clave de búsqueda (para búsquedas por nombre) */
    private String searchKey;
    
    /** JSON completo de la respuesta (incluye estadísticas) */
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
