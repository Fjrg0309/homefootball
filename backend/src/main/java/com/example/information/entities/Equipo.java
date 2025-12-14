package com.example.information.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String fechaFundacion;

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;

    @OneToMany(mappedBy = "equipo", cascade = CascadeType.ALL)
    private List<Jugador> jugadores;

    @OneToOne
    @JoinColumn(name = "entrenador_id", nullable = false)
    private Entrenador entrenador;
}
