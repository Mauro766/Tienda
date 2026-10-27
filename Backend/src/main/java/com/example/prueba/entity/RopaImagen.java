
package com.example.prueba.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ropa_imagenes")
public class RopaImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagen_url", nullable = false)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ropa_id", nullable = false)
    @JsonIgnore
    private Ropa ropa;

    public RopaImagen() {
    }

    public RopaImagen(String imagenUrl, Ropa ropa) {
        this.imagenUrl = imagenUrl;
        this.ropa = ropa;
    }

    public Long getId() {
        return id;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Ropa getRopa() {
        return ropa;
    }

    public void setRopa(Ropa ropa) {
        this.ropa = ropa;
    }
}
