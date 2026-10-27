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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.nio.file.Path;

@Service
public class RopaService {

    private final RopaRepository ropaRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final PedidoItemRepository pedidoItemRepository;
    private final StorageService storageService;

    private final String URL_BASE = "/uploads/";

    public RopaService(
            RopaRepository ropaRepository,
            CarritoItemRepository carritoItemRepository,
            PedidoItemRepository pedidoItemRepository,
            StorageService storageService) {
        this.ropaRepository = ropaRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.pedidoItemRepository = pedidoItemRepository;
        this.storageService = storageService;
    }

    private void asignarTallas(Ropa ropa, List<String> tallas) {
        ropa.getTallas().clear();

        if (tallas != null) {
            for (String talla : tallas) {
                ropa.getTallas().add(new RopaTalla(talla, ropa));
            }
        }
    }

    private void asignarImagenes(Ropa ropa, List<String> imagenes) {
        ropa.getImagenesUrl().clear();

        if (imagenes != null) {
            for (String imagen : imagenes) {
                ropa.getImagenesUrl().add(new RopaImagen(imagen, ropa));
            }
        }
    }

    private void agregarPrefijoImagenes(RopaDTO dto) {
        if (dto.getImagenesUrl() != null && !dto.getImagenesUrl().isEmpty()) {
            dto.setImagenesUrl(
                    dto.getImagenesUrl().stream()
                            .map(img -> URL_BASE + img)
                            .collect(Collectors.toList()));
        }
    }

    // Crear ropa
    public RopaDTO crear(RopaCreateDTO dto, List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = RopaMapper.toEntity(dto);

        List<String> nombres = new ArrayList<>();

        if (imagenes != null) {
            for (MultipartFile img : imagenes) {
                if (img != null && !img.isEmpty()) {
                    nombres.add(storageService.guardarArchivo(img));
                }
            }
        }

        asignarImagenes(ropa, nombres);

        Ropa guardada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(guardada);
        agregarPrefijoImagenes(respuesta);

        return respuesta;
    }

    // Listar todas o buscar por nombre
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

        page.forEach(this::agregarPrefijoImagenes);
        return page;
    }

    // Buscar por nombre
    public Page<RopaDTO> buscarPorNombre(String nombre, Pageable pageable) {

        Page<RopaDTO> page = ropaRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable)
                .map(RopaMapper::toDTO);

        page.forEach(this::agregarPrefijoImagenes);
        return page;
    }

    // Listar todos los productos
    public List<RopaDTO> listarTodos() {

        List<RopaDTO> lista = ropaRepository.findAll()
                .stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(this::agregarPrefijoImagenes);
        return lista;
    }

    // Filtrar productos
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

        page.forEach(this::agregarPrefijoImagenes);
        return page;
    }

    // Actualizar producto
    public RopaDTO actualizar(
            Long id,
            RopaUpdateDTO dto,
            List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        ropa.setNombre(dto.getNombre());
        ropa.setDescripcion(dto.getDescripcion());
        ropa.setPrecio(dto.getPrecio());
        ropa.setStock(dto.getStock());
        ropa.setCategoria(dto.getCategoria());
        ropa.setMarca(dto.getMarca());
        ropa.setColor(dto.getColor());

        if (dto.getTallas() != null) {
            asignarTallas(ropa, dto.getTallas());
        }

        if (dto.getActivo() != null) {
            ropa.setActivo(dto.getActivo());
        }

        // Reemplazar las imágenes solo si llegan archivos válidos.
        if (imagenes != null && !imagenes.isEmpty()) {

            List<String> nombres = new ArrayList<>();

            for (MultipartFile img : imagenes) {
                if (img != null && !img.isEmpty()) {
                    nombres.add(storageService.guardarArchivo(img));
                }
            }

            if (!nombres.isEmpty()) {
                asignarImagenes(ropa, nombres);
            }
        }

        Ropa actualizada = ropaRepository.save(ropa);

        RopaDTO respuesta = RopaMapper.toDTO(actualizada);
        agregarPrefijoImagenes(respuesta);

        return respuesta;
    }

    // Reemplazar todas las imágenes del producto
    @Transactional
    public RopaDTO actualizarImagen(
            Long id,
            List<MultipartFile> imagenes) throws Exception {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        // Guardar los nombres anteriores antes de reemplazar la relación.
        List<String> imagenesViejas = ropa.getImagenesUrl() == null
                ? new ArrayList<>()
                : ropa.getImagenesUrl().stream()
                        .map(RopaImagen::getImagenUrl)
                        .collect(Collectors.toList());

        // Guardar las imágenes nuevas.
        List<String> nuevas = new ArrayList<>();

        if (imagenes != null) {
            for (MultipartFile img : imagenes) {
                if (img != null && !img.isEmpty()) {
                    nuevas.add(storageService.guardarArchivo(img));
                }
            }
        }

        asignarImagenes(ropa, nuevas);
        Ropa actualizada = ropaRepository.saveAndFlush(ropa);

        // Eliminar los archivos antiguos solo si ya no están referenciados.
        for (String nombre : imagenesViejas) {
            if (nombre == null || nombre.isBlank() || nuevas.contains(nombre)) {
                continue;
            }

            Path rutaVieja = storageService.resolverArchivo(nombre);

            try {
                Files.deleteIfExists(rutaVieja);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        RopaDTO respuesta = RopaMapper.toDTO(actualizada);
        agregarPrefijoImagenes(respuesta);

        return respuesta;
    }

    // Buscar producto por ID
    public RopaDTO buscarPorId(Long id) {

        Ropa ropa = ropaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        RopaDTO dto = RopaMapper.toDTO(ropa);
        agregarPrefijoImagenes(dto);

        return dto;
    }

    // Filtrar por categoría
    public List<RopaDTO> filtrarPorCategoria(String categoria) {

        List<RopaDTO> lista = ropaRepository
                .findByCategoriaAndActivoTrue(categoria)
                .stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(this::agregarPrefijoImagenes);
        return lista;
    }

    // Eliminar producto
    @Transactional
    public void eliminar(Long id) {

        Ropa ropa = ropaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Ropa no encontrada"));

        if (pedidoItemRepository.existsByProductoId(id)) {
            throw new IllegalStateException(
                    "No se puede eliminar este producto porque ya forma parte de pedidos registrados. Puedes ocultarlo desde el panel admin.");
        }

        carritoItemRepository.deleteByProductoId(id);

        List<String> imagenes = ropa.getImagenesUrl() == null
                ? new ArrayList<>()
                : ropa.getImagenesUrl().stream()
                        .map(RopaImagen::getImagenUrl)
                        .collect(Collectors.toList());

        ropaRepository.delete(ropa);
        ropaRepository.flush();

        for (String imgUrl : imagenes) {
            if (imgUrl == null || imgUrl.isBlank()) {
                continue;
            }

            String nombreArchivo = imgUrl.startsWith(URL_BASE)
                    ? imgUrl.substring(URL_BASE.length())
                    : imgUrl;

            Path ruta = storageService.resolverArchivo(nombreArchivo);

            try {
                Files.deleteIfExists(ruta);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
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

    @Transactional(readOnly = true)
    public List<RopaDTO> obtenerProductosMasVendidos(int limite) {
        int limiteFinal = limite > 0 ? limite : 3;
        Pageable pageable = PageRequest.of(0, limiteFinal);

        Page<Ropa> page = ropaRepository.findByActivoTrueAndCantidadVentasGreaterThanEqualOrderByCantidadVentasDesc(5,
                pageable);
        List<RopaDTO> lista = page.stream()
                .map(RopaMapper::toDTO)
                .collect(Collectors.toList());

        lista.forEach(r -> {
            if (r.getImagenesUrl() != null && !r.getImagenesUrl().isEmpty()) {
                r.setImagenesUrl(
                        r.getImagenesUrl().stream()
                                .map(img -> URL_BASE + img)
                                .collect(Collectors.toList()));
            }
        });

        return lista;
    }
}
