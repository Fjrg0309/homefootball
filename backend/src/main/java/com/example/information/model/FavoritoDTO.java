package com.example.information.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoDTO {
    private Long id;
    private Long usuarioId;
    private String tipo;
    private Long itemId;
    private String nombre;
    private String imagen;
    private String fechaCreacion;
}
