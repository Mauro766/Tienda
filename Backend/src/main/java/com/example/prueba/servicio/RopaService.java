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
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class RopaService {

    private final RopaRepository ropaRepository;
    private final StorageService storageService;

    private final String URL_BASE = "/uploads/";

    public RopaService(RopaRepository ropaRepository, StorageService storageService) {
        this.ropaRepository = ropaRepository;
        this.storageService = storageService;
    }

    // 🔹 Crear ropa
    public RopaDTO crear(RopaCreateDTO dto, List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = RopaMapper.toEntity(dto);

        if (imagenes != null && !imagenes.isEmpty()) {
            List<String> nombres = new ArrayList<>();
            for (MultipartFile img : imagenes) {
                if (!img.isEmpty()) {
                    String nombreImagen = storageService.guardarArchivo(img);
                    nombres.add(nombreImagen);
                }
            }
            ropa.setImagenesUrl(nombres);
        } else {
            ropa.setImagenesUrl(new ArrayList<>());
        }

        Ropa guardada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(guardada);

        if (guardada.getImagenesUrl() != null && !guardada.getImagenesUrl().isEmpty()) {
            respuesta.setImagenesUrl(
                guardada.getImagenesUrl().stream()
                        .map(img -> URL_BASE + img)
                        .collect(Collectors.toList())
            );
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
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                    r.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList())
                );
            }
        });

        return page;
    }

    public Page<RopaDTO> buscarPorNombre(String nombre, Pageable pageable) {

        Page<RopaDTO> page = ropaRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable)
                .map(RopaMapper::toDTO);

        page.forEach(r -> {
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                    r.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList())
                );
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
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                    r.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList())
                );
            }
        });

        return lista;
    }

    public Page<RopaDTO> filtrar(
            String nombre,
            String categoria,
            Double precioMin,
            Double precioMax,
            String color,
            String talla,
            Pageable pageable) {

        Page<RopaDTO> page = ropaRepository
                .filtrar(nombre, categoria, precioMin, precioMax, color, talla, pageable)
                .map(RopaMapper::toDTO);

        page.forEach(r -> {
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                    r.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList())
                );
            }
        });

        return page;
    }

    // 🔹 Actualizar
    public RopaDTO actualizar(Long id, RopaUpdateDTO dto, List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        ropa.setNombre(dto.getNombre());
        ropa.setDescripcion(dto.getDescripcion());
        ropa.setPrecio(dto.getPrecio());
        ropa.setStock(dto.getStock());
        ropa.setCategoria(dto.getCategoria());
        ropa.setMarca(dto.getMarca());
        ropa.setTallas(dto.getTallas() != null ? dto.getTallas() : new ArrayList<>());
        ropa.setColor(dto.getColor());

        if (dto.getActivo() != null) {
            ropa.setActivo(dto.getActivo());
        }

        // Si se suben nuevas imagenes, reemplazamos las anteriores
        if (imagenes != null && !imagenes.isEmpty()) {
            List<String> nombres = new ArrayList<>();
            for (MultipartFile img : imagenes) {
                if (!img.isEmpty()) {
                    String nombreImagen = storageService.guardarArchivo(img);
                    nombres.add(nombreImagen);
                }
            }
            if (!nombres.isEmpty()) {
                ropa.setImagenesUrl(nombres);
            }
        }

        Ropa actualizada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(actualizada);

        if (actualizada.getImagenesUrl() != null && !actualizada.getImagenesUrl().isEmpty()) {
            respuesta.setImagenesUrl(
                actualizada.getImagenesUrl().stream()
                        .map(img -> URL_BASE + img)
                        .collect(Collectors.toList())
            );
        }

        return respuesta;
    }

    // Actualizar Imagenes (Reemplazar todas por las nuevas)
    public RopaDTO actualizarImagen(Long id, List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        // borrar imagenes viejas
        if (ropa.getImagenesUrl() != null) {
            for (String imgVieja : ropa.getImagenesUrl()) {
                Path rutaVieja = Paths.get("src/main/resources/static/uploads", imgVieja);
                try {
                    Files.deleteIfExists(rutaVieja);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // guardar nuevas imagenes
        List<String> nuevas = new java.util.ArrayList<>();
        if (imagenes != null) {
            for (MultipartFile img : imagenes) {
                if (!img.isEmpty()) {
                    nuevas.add(storageService.guardarArchivo(img));
                }
            }
        }

        ropa.setImagenesUrl(nuevas);

        Ropa actualizada = ropaRepository.save(ropa);

        RopaDTO dto = RopaMapper.toDTO(actualizada);

        if (actualizada.getImagenesUrl() != null && !actualizada.getImagenesUrl().isEmpty()) {
            dto.setImagenesUrl(
                actualizada.getImagenesUrl().stream()
                        .map(img -> "http://localhost:8081/uploads/" + img)
                        .collect(Collectors.toList())
            );
        }

        return dto;
    }

    // 🔹 Buscar por id
    public RopaDTO buscarPorId(Long id) {

        Ropa ropa = ropaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        RopaDTO dto = RopaMapper.toDTO(ropa);

        if (ropa.getImagenesUrl() != null && !ropa.getImagenesUrl().isEmpty()) {
            dto.setImagenesUrl(
                ropa.getImagenesUrl().stream()
                        .map(img -> URL_BASE + img)
                        .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public List<RopaDTO> filtrarPorCategoria(String categoria) {

        List<RopaDTO> lista = ropaRepository.findByCategoriaAndActivoTrue(categoria)
                .stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(r -> {
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                    r.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList())
                );
            }
        });

        return lista;
    }

    public void eliminar(Long id) {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        if (ropa.getImagenesUrl() != null) {
            for (String imgUrl : ropa.getImagenesUrl()) {
                Path ruta = Paths.get("src/main/resources/static/uploads", imgUrl);
                try {
                    Files.deleteIfExists(ruta);
                } catch (IOException e) {
                    e.printStackTrace();
                }
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