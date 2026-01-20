package com.example.information.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoRequest {
    private String tipo;
    private Long itemId;
    private String nombre;
    private String imagen;
}
