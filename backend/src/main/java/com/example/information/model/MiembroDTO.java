package com.example.information.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MiembroDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    private String fechaNacimiento;

    @NotBlank(message = "La nacionalidad es obligatoria")
    @Size(min = 2, max = 50, message = "La nacionalidad debe tener entre 2 y 50 caracteres")
    private String nacionalidad;

    private String tipo; // "Jugador" o "Entrenador"
}
