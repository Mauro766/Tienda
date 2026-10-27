
package com.example.prueba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "ropa")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private String categoria;

    private String marca;

    // Columna antigua, se conserva temporalmente por compatibilidad.
    @Column(name = "talla", nullable = true)
    private String talla = "DEPRECATED";

    @OneToMany(
        mappedBy = "ropa",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<RopaTalla> tallas = new ArrayList<>();

    @Column(nullable = false)
    private String color;

    @OneToMany(
        mappedBy = "ropa",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<RopaImagen> imagenesUrl = new ArrayList<>();

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Integer cantidadVentas = 0;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}
