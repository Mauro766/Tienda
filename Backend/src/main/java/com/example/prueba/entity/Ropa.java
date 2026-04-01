package com.example.prueba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

//Esta clase se encarga de crear las tabla de ropa
@Entity
@Table(name = "ropa")
@Data //Genra el getter y setter
@NoArgsConstructor //Crea un contrustor vacio
@AllArgsConstructor //Gera un constructor con todos los campos
public class Ropa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String categoria; // remera, pantalon, campera

    private String marca;

    // TODO: Eliminar esta columna de la DB manualmente (ALTER TABLE ropa DROP COLUMN talla)
    // Se deja temporalmente para que Hibernate la marque como NULLABLE y no falle el INSERT
    @Column(name = "talla", nullable = true)
    private String talla = "DEPRECATED"; 

    @ElementCollection
    @CollectionTable(name = "ropa_tallas", joinColumns = @JoinColumn(name = "ropa_id"))
    @Column(name = "talla")
    private List<String> tallas = new ArrayList<>();

    @Column(nullable = false)
    private String color;

    @ElementCollection
    @CollectionTable(name = "ropa_imagenes", joinColumns = @JoinColumn(name = "ropa_id"))
    @Column(name = "imagen_url")
    private List<String> imagenesUrl = new ArrayList<>();

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    // getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public List<String> getTallas() {
        return tallas;
    }

    public void setTallas(List<String> tallas) {
        this.tallas = tallas;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<String> getImagenesUrl() {
        return imagenesUrl;
    }

    public void setImagenesUrl(List<String> imagenesUrl) {
        this.imagenesUrl = imagenesUrl;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

}
