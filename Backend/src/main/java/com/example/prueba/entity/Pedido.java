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
@Entity
@Table(name = "pedido")
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

  public Pedido() {
  }

  public Pedido(Long id, Usuario usuario, String direccion, String ciudad, String telefono, BigDecimal total,
      LocalDateTime fecha, List<PedidoItem> items, EstadoPedido estado) {
    this.id = id;
    this.usuario = usuario;
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.telefono = telefono;
    this.total = total;
    this.fecha = fecha;
    this.items = items;
    this.estado = estado;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Usuario getUsuario() {
    return usuario;
  }

  public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
  }

  public String getDireccion() {
    return direccion;
  }

  public void setDireccion(String direccion) {
    this.direccion = direccion;
  }

  public String getCiudad() {
    return ciudad;
  }

  public void setCiudad(String ciudad) {
    this.ciudad = ciudad;
  }

  public String getTelefono() {
    return telefono;
  }

  public void setTelefono(String telefono) {
    this.telefono = telefono;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }

  public LocalDateTime getFecha() {
    return fecha;
  }

  public void setFecha(LocalDateTime fecha) {
    this.fecha = fecha;
  }

  public List<PedidoItem> getItems() {
    return items;
  }

  public void setItems(List<PedidoItem> items) {
    this.items = items;
  }

  public EstadoPedido getEstado() {
    return estado;
  }

  public void setEstado(EstadoPedido estado) {
    this.estado = estado;
  }

}
