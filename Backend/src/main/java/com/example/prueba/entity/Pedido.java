package com.example.prueba.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "pedido")
@AllArgsConstructor
@NoArgsConstructor
public class Pedido {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  @Column(nullable = false)
  private String direccion;

  @Column(nullable = false)
  private String ciudad;

  @Column(nullable = false)
  private String telefono;

  @Column(nullable = false)
  private BigDecimal total;

  @Column(updatable = false)
  private LocalDateTime fecha;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<PedidoItem> items = new ArrayList<>();

  @Convert(converter = EstadoPedidoConverter.class)
  private EstadoPedido estado; // PENDIENTE, ENVIADO, ARCHIVADO

  @PrePersist
  public void prePersist() {
    this.fecha = LocalDateTime.now();
    this.estado = EstadoPedido.PENDIENTE;
  }

}
