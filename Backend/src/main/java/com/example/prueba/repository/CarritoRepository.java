package com.example.prueba.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.prueba.entity.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioId(Long usuarioId);
}
