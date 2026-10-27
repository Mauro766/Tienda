package com.example.prueba.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ropa_tallas")
public class RopaTalla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String talla;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ropa_id", nullable = false)
    @JsonIgnore
    private Ropa ropa;

    public RopaTalla() {
    }

    public RopaTalla(String talla, Ropa ropa) {
        this.talla = talla;
        this.ropa = ropa;
    }

    public Long getId() {
        return id;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public Ropa getRopa() {
        return ropa;
    }

    public void setRopa(Ropa ropa) {
        this.ropa = ropa;
    }
}
