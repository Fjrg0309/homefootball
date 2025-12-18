package com.example.information.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Entrenador extends Miembro {

    @Column(nullable = false)
    private int aniosExperiencia;

    @Column(nullable = false)
    private int titulosGanados;

    @OneToOne(mappedBy = "entrenador", optional = false)
    private Equipo equipo;
}
