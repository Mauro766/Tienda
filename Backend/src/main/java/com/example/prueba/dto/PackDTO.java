
package com.example.prueba.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PackDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private BigDecimal precioPack;
    private BigDecimal precioTotalPrendas;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    private Long ropaSuperiorId;
    private String ropaSuperiorNombre;
    private BigDecimal ropaSuperiorPrecio;
    private String ropaSuperiorImagen;

    private Long ropaInferiorId;
    private String ropaInferiorNombre;
    private BigDecimal ropaInferiorPrecio;
    private String ropaInferiorImagen;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public BigDecimal getPrecioPack() { return precioPack; }
    public void setPrecioPack(BigDecimal precioPack) { this.precioPack = precioPack; }

    public BigDecimal getPrecioTotalPrendas() { return precioTotalPrendas; }
    public void setPrecioTotalPrendas(BigDecimal precioTotalPrendas) {
        this.precioTotalPrendas = precioTotalPrendas;
    }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getRopaSuperiorId() { return ropaSuperiorId; }
    public void setRopaSuperiorId(Long ropaSuperiorId) {
        this.ropaSuperiorId = ropaSuperiorId;
    }

    public String getRopaSuperiorNombre() { return ropaSuperiorNombre; }
    public void setRopaSuperiorNombre(String ropaSuperiorNombre) {
        this.ropaSuperiorNombre = ropaSuperiorNombre;
    }

    public BigDecimal getRopaSuperiorPrecio() { return ropaSuperiorPrecio; }
    public void setRopaSuperiorPrecio(BigDecimal ropaSuperiorPrecio) {
        this.ropaSuperiorPrecio = ropaSuperiorPrecio;
    }

    public String getRopaSuperiorImagen() { return ropaSuperiorImagen; }
    public void setRopaSuperiorImagen(String ropaSuperiorImagen) {
        this.ropaSuperiorImagen = ropaSuperiorImagen;
    }

    public Long getRopaInferiorId() { return ropaInferiorId; }
    public void setRopaInferiorId(Long ropaInferiorId) {
        this.ropaInferiorId = ropaInferiorId;
    }

    public String getRopaInferiorNombre() { return ropaInferiorNombre; }
    public void setRopaInferiorNombre(String ropaInferiorNombre) {
        this.ropaInferiorNombre = ropaInferiorNombre;
    }

    public BigDecimal getRopaInferiorPrecio() { return ropaInferiorPrecio; }
    public void setRopaInferiorPrecio(BigDecimal ropaInferiorPrecio) {
        this.ropaInferiorPrecio = ropaInferiorPrecio;
    }

    public String getRopaInferiorImagen() { return ropaInferiorImagen; }
    public void setRopaInferiorImagen(String ropaInferiorImagen) {
        this.ropaInferiorImagen = ropaInferiorImagen;
    }
}
