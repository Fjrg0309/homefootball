package com.example.information.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "tipo", "item_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoFavorito tipo;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(length = 255)
    private String nombre;

    @Column(length = 500)
    private String imagen;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public enum TipoFavorito {
        LIGA,
        EQUIPO,
        JUGADOR
    }
}
