package com.example.prueba.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.prueba.entity.EstadoPedido;
import com.example.prueba.entity.Pedido;
import com.example.prueba.entity.Ropa;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioId(Long usuarioId);

    List<Pedido> findByCiudadContainingIgnoreCase(String ciudad);

    List<Pedido> findByDireccionContainingIgnoreCase(String direccion);

    List<Pedido> findByCiudadContainingIgnoreCaseAndDireccionContainingIgnoreCase(String ciudad, String direccion);

    @Query("""
            SELECT i.producto
            FROM PedidoItem i
            JOIN i.pedido p
            WHERE p.estado <> :estadoExcluido
              AND i.producto.activo = true
            GROUP BY i.producto
            ORDER BY SUM(i.cantidad) DESC
            """)
    List<Ropa> obtenerProductosMasVendidos(
            @Param("estadoExcluido") EstadoPedido estadoExcluido,
            Pageable pageable);

}
