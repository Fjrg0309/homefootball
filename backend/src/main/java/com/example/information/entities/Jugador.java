package com.example.information.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Jugador extends Miembro {

    @Column(nullable = false)
    private String posicion;

    @Column(nullable = false)
    private int numeroCamiseta;

    @Column(nullable = false)
    private int golesMarcados;

    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;
}
