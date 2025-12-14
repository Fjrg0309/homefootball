package com.example.information.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Liga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String pais;

    @Column(nullable = false)
    private String temporadaActual;

    @OneToMany(mappedBy = "liga", cascade = CascadeType.ALL)
    private List<Equipo> equipos;
}
