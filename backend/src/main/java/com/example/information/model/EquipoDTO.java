package com.example.information.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipoDTO {

    private Long id;

    @NotBlank(message = "El nombre del equipo es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La fecha de fundación es obligatoria")
    private String fechaFundacion;

    @NotNull(message = "El ID de la liga es obligatorio")
    private Long ligaId;

    private String ligaNombre;

    private Long entrenadorId;

    private String entrenadorNombre;

    private List<JugadorDTO> jugadores;

    private int totalJugadores;

    private int totalGoles;
}
