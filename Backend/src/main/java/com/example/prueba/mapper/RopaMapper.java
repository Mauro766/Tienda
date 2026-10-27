
package com.example.prueba.mapper;

import com.example.prueba.dto.RopaCreateDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.entity.Ropa;
import com.example.prueba.entity.RopaTalla;
import com.example.prueba.entity.RopaImagen;

import java.util.ArrayList;
import java.util.stream.Collectors;

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

        dto.setTallas(
            ropa.getTallas() == null
                ? new ArrayList<>()
                : ropa.getTallas().stream()
                    .map(RopaTalla::getTalla)
                    .collect(Collectors.toList())
        );

        dto.setColor(ropa.getColor());

        dto.setImagenesUrl(
            ropa.getImagenesUrl() == null
                ? new ArrayList<>()
                : ropa.getImagenesUrl().stream()
                    .map(RopaImagen::getImagenUrl)
                    .collect(Collectors.toList())
        );

        dto.setActivo(ropa.getActivo());
        dto.setCantidadVentas(
            ropa.getCantidadVentas() != null
                ? ropa.getCantidadVentas()
                : 0
        );

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
        ropa.setColor(dto.getColor());

        ropa.setActivo(true);
        ropa.setCantidadVentas(0);

        ropa.setTallas(new ArrayList<>());

        if (dto.getTallas() != null) {
            for (String talla : dto.getTallas()) {
                ropa.getTallas().add(new RopaTalla(talla, ropa));
            }
        }

        ropa.setImagenesUrl(new ArrayList<>());

        if (dto.getImagenesUrl() != null) {
            for (String imagenUrl : dto.getImagenesUrl()) {
                ropa.getImagenesUrl().add(
                    new RopaImagen(imagenUrl, ropa)
                );
            }
        }

        return ropa;
    }
}
