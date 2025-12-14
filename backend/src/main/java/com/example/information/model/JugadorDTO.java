package com.example.information.model;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JugadorDTO {

    private Long id;

    @NotBlank(message = "El nombre del jugador es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    private String fechaNacimiento;

    @NotBlank(message = "La nacionalidad es obligatoria")
    private String nacionalidad;

    @NotBlank(message = "La posición es obligatoria")
    private String posicion;

    @Min(value = 1, message = "El número de camiseta debe ser al menos 1")
    @Max(value = 99, message = "El número de camiseta no puede ser mayor a 99")
    private int numeroCamiseta;

    @Min(value = 0, message = "Los goles marcados no pueden ser negativos")
    private int golesMarcados;

    @NotNull(message = "El ID del equipo es obligatorio")
    private Long equipoId;

    private String equipoNombre;

    private String ligaNombre;
}
