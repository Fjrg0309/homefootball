package com.example.information.model;

import jakarta.validation.constraints.NotBlank;
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
public class LigaDTO {

    private Long id;

    @NotBlank(message = "El nombre de la liga es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @NotBlank(message = "La temporada actual es obligatoria")
    private String temporadaActual;

    private List<EquipoDTO> equipos;

    private int totalEquipos;
}
