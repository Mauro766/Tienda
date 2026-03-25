package com.example.prueba.mapper;

import com.example.prueba.dto.RopaCreateDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.entity.Ropa;

public class RopaMapper {

    public static RopaDTO toDTO(Ropa ropa) {
        RopaDTO dto = new RopaDTO();
        dto.setId(ropa.getId());
        dto.setNombre(ropa.getNombre());
        dto.setDescripcion(ropa.getDescripcion());
        dto.setPrecio(ropa.getPrecio());
        dto.setStock(ropa.getStock());
        dto.setCategoria(ropa.getCategoria());
        dto.setMarca(ropa.getMarca());
        dto.setTalla(ropa.getTalla());
        dto.setColor(ropa.getColor());
        if (ropa.getImagenUrl() != null) {
        dto.setImagenUrl("http://localhost:8081/uploads/" + ropa.getImagenUrl());
    }

        return dto;
    }

     public static Ropa toEntity(RopaCreateDTO dto) {
        Ropa ropa = new Ropa();
        ropa.setNombre(dto.getNombre());
        ropa.setDescripcion(dto.getDescripcion());
        ropa.setPrecio(dto.getPrecio());
        ropa.setStock(dto.getStock());
        ropa.setCategoria(dto.getCategoria());
        ropa.setMarca(dto.getMarca());
        ropa.setTalla(dto.getTalla());
        ropa.setColor(dto.getColor());
        ropa.setImagenUrl(dto.getImagenUrl());

        // valores por defecto
        ropa.setActivo(true);

        return ropa;
    }
}
