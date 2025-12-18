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
public class EntrenadorDTO {

    private Long id;

    @NotBlank(message = "El nombre del entrenador es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    private String fechaNacimiento;

    @NotBlank(message = "La nacionalidad es obligatoria")
    private String nacionalidad;

    @Min(value = 0, message = "Los años de experiencia no pueden ser negativos")
    private int aniosExperiencia;

    @Min(value = 0, message = "Los títulos ganados no pueden ser negativos")
    private int titulosGanados;

    private Long equipoId;

    private String equipoNombre;
}
