package com.example.information.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioDTO {
    private Long id;
    private Long matchId;
    private Long usuarioId;
    private String username;
    private String texto;
    private String fechaCreacion;
    private boolean isOwner;
}
