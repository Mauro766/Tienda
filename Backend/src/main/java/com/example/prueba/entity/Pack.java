
package com.example.prueba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "packs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, length = 1000)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ropa_superior_id", nullable = false)
    private Ropa ropaSuperior;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ropa_inferior_id", nullable = false)
    private Ropa ropaInferior;

    @Column(precision = 12, scale = 2)
    private BigDecimal precioPack;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}
