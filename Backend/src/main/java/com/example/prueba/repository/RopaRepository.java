package com.example.prueba.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.prueba.entity.*;

//Esta clase hace referencia a la tabla Ropa
@Repository
public interface RopaRepository extends JpaRepository<Ropa, Long> {

    List<Ropa> findByCategoriaAndActivoTrue(String categoria);

    Page<Ropa> findByActivoTrue(Pageable pageable);

    Page<Ropa> findByNombreContainingIgnoreCaseAndActivoTrue(
            String nombre,
            Pageable pageable);

    Optional<Ropa> findByIdAndActivoTrue(Long id);

    Page<Ropa> findByActivoTrueAndNombreContainingIgnoreCaseAndCategoria(
            String nombre,
            String categoria,
            Pageable pageable);

    Page<Ropa> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable);

    Page<Ropa> findByActivoTrueAndCategoria(
            String categoria,
            Pageable pageable);

    @Query("""
        SELECT r FROM Ropa r
        LEFT JOIN r.tallas t
        WHERE r.activo = true
        AND (:nombre IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
        AND (:categoria IS NULL OR r.categoria = :categoria)
        AND (:precioMin IS NULL OR r.precio >= :precioMin)
        AND (:precioMax IS NULL OR r.precio <= :precioMax)
        AND (:color IS NULL OR LOWER(r.color) = LOWER(:color))
        AND (:talla IS NULL OR t = :talla)
    """)
    Page<Ropa> filtrar(
            @Param("nombre") String nombre,
            @Param("categoria") String categoria,
            @Param("precioMin") Double precioMin,
            @Param("precioMax") Double precioMax,
            @Param("color") String color,
            @Param("talla") String talla,
            Pageable pageable
    );

}
