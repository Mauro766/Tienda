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
        dto.setTallas(ropa.getTallas());
        dto.setColor(ropa.getColor());
        dto.setImagenesUrl(ropa.getImagenesUrl());
        dto.setActivo(ropa.getActivo());

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
        ropa.setTallas(dto.getTallas() != null ? dto.getTallas() : new java.util.ArrayList<>());
        ropa.setColor(dto.getColor());
        ropa.setImagenesUrl(dto.getImagenesUrl());

        // valores por defecto
        ropa.setActivo(true);

        return ropa;
    }
}
