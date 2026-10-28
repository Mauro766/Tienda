
package com.example.prueba.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PackUpdateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    @NotNull(message = "Debes seleccionar la prenda superior")
    @Positive
    private Long ropaSuperiorId;

    @NotNull(message = "Debes seleccionar la prenda inferior")
    @Positive
    private Long ropaInferiorId;

    @Positive(message = "El precio del pack debe ser mayor a cero")
    private BigDecimal precioPack;

    private Boolean activo;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getRopaSuperiorId() {
        return ropaSuperiorId;
    }

    public void setRopaSuperiorId(Long ropaSuperiorId) {
        this.ropaSuperiorId = ropaSuperiorId;
    }

    public Long getRopaInferiorId() {
        return ropaInferiorId;
    }

    public void setRopaInferiorId(Long ropaInferiorId) {
        this.ropaInferiorId = ropaInferiorId;
    }

    public BigDecimal getPrecioPack() {
        return precioPack;
    }

    public void setPrecioPack(BigDecimal precioPack) {
        this.precioPack = precioPack;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
