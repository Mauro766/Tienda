package com.example.prueba.servicio;

import com.example.prueba.dto.RopaCreateDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.dto.RopaUpdateDTO;
import com.example.prueba.entity.*;
import com.example.prueba.exception.RecursoNoEncontradoException;
import com.example.prueba.mapper.RopaMapper;
import com.example.prueba.repository.*;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class RopaService {

    private final RopaRepository ropaRepository;
    private final StorageService storageService;

    private final String URL_BASE = "http://localhost:8081/uploads/";

    public RopaService(RopaRepository ropaRepository, StorageService storageService) {
        this.ropaRepository = ropaRepository;
        this.storageService = storageService;
    }

    // 🔹 Crear ropa
    public RopaDTO crear(RopaCreateDTO dto, MultipartFile imagen) throws Exception {

        Ropa ropa = RopaMapper.toEntity(dto);

        if (imagen != null && !imagen.isEmpty()) {
            String nombreImagen = storageService.guardarArchivo(imagen);
            ropa.setImagenUrl(nombreImagen); // guardamos solo el nombre
        }

        Ropa guardada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(guardada);

        if (guardada.getImagenUrl() != null) {
            respuesta.setImagenUrl(URL_BASE + guardada.getImagenUrl());
        }

        return respuesta;
    }

    // 🔹 Listar todas
    public Page<RopaDTO> listar(String nombre, Pageable pageable) {

        Page<RopaDTO> page;

        if (nombre != null && !nombre.isBlank()) {
            page = ropaRepository
                    .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable)
                    .map(RopaMapper::toDTO);
        } else {
            page = ropaRepository
                    .findByActivoTrue(pageable)
                    .map(RopaMapper::toDTO);
        }

        page.forEach(r -> {
            if (r.getImagenUrl() != null) {
                r.setImagenUrl(URL_BASE + r.getImagenUrl());
            }
        });

        return page;
    }

    public Page<RopaDTO> buscarPorNombre(String nombre, Pageable pageable) {

        Page<RopaDTO> page = ropaRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable)
                .map(RopaMapper::toDTO);

        page.forEach(r -> {
            if (r.getImagenUrl() != null) {
                r.setImagenUrl(URL_BASE + r.getImagenUrl());
            }
        });

        return page;
    }

    public List<RopaDTO> listarTodos() {

        List<RopaDTO> lista = ropaRepository.findAll()
                .stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(r -> {
            if (r.getImagenUrl() != null) {
                r.setImagenUrl(URL_BASE + r.getImagenUrl());
            }
        });

        return lista;
    }

    public Page<RopaDTO> filtrar(
            String nombre,
            String categoria,
            Double precioMin,
            Double precioMax,
            Pageable pageable) {

        Page<RopaDTO> page = ropaRepository
                .filtrar(nombre, categoria, precioMin, precioMax, pageable)
                .map(RopaMapper::toDTO);

        page.forEach(r -> {
            if (r.getImagenUrl() != null) {
                r.setImagenUrl(URL_BASE + r.getImagenUrl());
            }
        });

        return page;
    }

    // 🔹 Actualizar
    public RopaDTO actualizar(Long id, RopaUpdateDTO dto) {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        ropa.setNombre(dto.getNombre());
        ropa.setDescripcion(dto.getDescripcion());
        ropa.setPrecio(dto.getPrecio());
        ropa.setStock(dto.getStock());
        ropa.setCategoria(dto.getCategoria());
        ropa.setMarca(dto.getMarca());
        ropa.setTalla(dto.getTalla());
        ropa.setColor(dto.getColor());

        if (dto.getActivo() != null) {
            ropa.setActivo(dto.getActivo());
        }

        Ropa actualizada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(actualizada);

        if (actualizada.getImagenUrl() != null) {
            respuesta.setImagenUrl(URL_BASE + actualizada.getImagenUrl());
        }

        return respuesta;
    }

    //Actualizar Imagen//Actualizar Imagen
    public RopaDTO actualizarImagen(Long id, MultipartFile imagen) throws Exception {

    Ropa ropa = ropaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

    // borrar imagen vieja
    if (ropa.getImagenUrl() != null) {
Path rutaVieja = Paths.get("src/main/resources/static/uploads", ropa.getImagenUrl());
        try {
            Files.deleteIfExists(rutaVieja);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // guardar nueva imagen
    String nuevaImagen = storageService.guardarArchivo(imagen);

    ropa.setImagenUrl(nuevaImagen);

    Ropa actualizada = ropaRepository.save(ropa);

    RopaDTO dto = RopaMapper.toDTO(actualizada);

    dto.setImagenUrl("http://localhost:8081/uploads/" + nuevaImagen);

    return dto;
}


    // 🔹 Buscar por id
    public RopaDTO buscarPorId(Long id) {

        Ropa ropa = ropaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        RopaDTO dto = RopaMapper.toDTO(ropa);

        if (ropa.getImagenUrl() != null) {
            dto.setImagenUrl(URL_BASE + ropa.getImagenUrl());
        }

        return dto;
    }

    public List<RopaDTO> filtrarPorCategoria(String categoria) {

        List<RopaDTO> lista = ropaRepository.findByCategoriaAndActivoTrue(categoria)
                .stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(r -> {
            if (r.getImagenUrl() != null) {
                r.setImagenUrl(URL_BASE + r.getImagenUrl());
            }
        });

        return lista;
    }

    public void eliminar(Long id) {

    Ropa ropa = ropaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

    if (ropa.getImagenUrl() != null) {

Path ruta = Paths.get("src/main/resources/static/uploads", ropa.getImagenUrl());
        try {
            Files.deleteIfExists(ruta);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    ropaRepository.deleteById(id);
}


    public void desactivar(Long id) {
        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));
        ropa.setActivo(false);
        ropaRepository.save(ropa);
    }

    public void activar(Long id) {
        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));
        ropa.setActivo(true);
        ropaRepository.save(ropa);
    }
}