package com.example.prueba.dto;

import java.util.List;

public class SincronizarCarritoRequest {
    private Long usuarioId;
    private List<ItemSincronizable> items;

    public static class ItemSincronizable {
        private Long ropaId;
        private Integer cantidad;

        // Getters y Setters
        public Long getRopaId() { return ropaId; }
        public void setRopaId(Long ropaId) { this.ropaId = ropaId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public List<ItemSincronizable> getItems() { return items; }
    public void setItems(List<ItemSincronizable> items) { this.items = items; }
}
