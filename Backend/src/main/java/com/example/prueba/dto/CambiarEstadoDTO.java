package com.example.prueba.dto;

import com.example.prueba.entity.EstadoPedido;

public class CambiarEstadoDTO {
    private EstadoPedido estado;

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
}
