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

    
private String resolverUrlImagen(String imagen) {
    if (imagen == null || imagen.isBlank()) {
        return imagen;
    }

    // Las imágenes nuevas ya tienen URL completa.
    if (imagen.startsWith("https://") || imagen.startsWith("http://")) {
        return imagen;
    }

    // Compatibilidad con las imágenes antiguas.
    return URL_BASE + imagen;
}

private void agregarPrefijoImagenes(RopaDTO dto) {
    if (dto.getImagenesUrl() != null) {
        dto.setImagenesUrl(
                dto.getImagenesUrl().stream()
                        .map(this::resolverUrlImagen)
                        .collect(Collectors.toList())
        );
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
   
@Transactional
public RopaDTO actualizar(
        Long id,
        RopaUpdateDTO dto,
        List<MultipartFile> imagenes,
        String modoImagen) throws Exception {

    Ropa ropa = ropaRepository.findById(id)
            .orElseThrow(() ->
                    new RecursoNoEncontradoException("Ropa no encontrada"));

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

    List<MultipartFile> archivos = imagenes == null
            ? new ArrayList<>()
            : imagenes.stream()
                    .filter(img -> img != null && !img.isEmpty())
                    .collect(Collectors.toList());

   
if (!archivos.isEmpty()) {
    List<String> anteriores = ropa.getImagenesUrl().stream()
            .map(RopaImagen::getImagenUrl)
            .collect(Collectors.toList());

    List<String> nuevas = new ArrayList<>();

    for (MultipartFile archivo : archivos) {
        nuevas.add(storageService.guardarArchivo(archivo));
    }

    if ("agregar".equalsIgnoreCase(modoImagen)) {
        anteriores.addAll(nuevas);
        asignarImagenes(ropa, anteriores);

    } else if ("reemplazar".equalsIgnoreCase(modoImagen)) {
        asignarImagenes(ropa, nuevas);

    } else {
        throw new IllegalArgumentException(
                "El modo de imagen debe ser 'agregar' o 'reemplazar'");
    }

    Ropa actualizada = ropaRepository.saveAndFlush(ropa);

    // Al reemplazar, limpiar las imágenes anteriores de Cloudinary.
    if ("reemplazar".equalsIgnoreCase(modoImagen)) {
        for (String urlAntigua : anteriores) {
            if (urlAntigua == null
                    || urlAntigua.isBlank()
                    || nuevas.contains(urlAntigua)) {
                continue;
            }

            if (urlAntigua.startsWith("https://res.cloudinary.com/")
                    || urlAntigua.startsWith("http://res.cloudinary.com/")) {
                try {
                    storageService.eliminarImagenCloudinary(urlAntigua);
                } catch (Exception e) {
                    System.err.println(
                            "No se pudo eliminar la imagen antigua de Cloudinary: "
                                    + urlAntigua + ". Error: " + e.getMessage());
                }
            }
        }
    }

    RopaDTO respuesta = RopaMapper.toDTO(actualizada);
    agregarPrefijoImagenes(respuesta);
    return respuesta;
}


    Ropa actualizada = ropaRepository.saveAndFlush(ropa);

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

    try {
        if (nombre.startsWith("https://res.cloudinary.com/")
                || nombre.startsWith("http://res.cloudinary.com/")) {

            storageService.eliminarImagenCloudinary(nombre);

        } else {
            String nombreArchivo = nombre.startsWith(URL_BASE)
                    ? nombre.substring(URL_BASE.length())
                    : nombre;

            Path rutaVieja = storageService.resolverArchivo(nombreArchivo);
            Files.deleteIfExists(rutaVieja);
        }
    } catch (Exception e) {
        System.err.println(
                "No se pudo limpiar la imagen antigua: "
                + nombre + ". Error: " + e.getMessage());
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
            .orElseThrow(() ->
                    new RecursoNoEncontradoException("Ropa no encontrada"));

    if (pedidoItemRepository.existsByProductoId(id)) {
        throw new IllegalStateException(
                "No se puede eliminar este producto porque ya forma parte "
                + "de pedidos registrados. Puedes ocultarlo desde el panel admin.");
    }

    List<String> imagenes = ropa.getImagenesUrl() == null
            ? new ArrayList<>()
            : ropa.getImagenesUrl().stream()
                    .map(RopaImagen::getImagenUrl)
                    .collect(Collectors.toList());

    carritoItemRepository.deleteByProductoId(id);

    ropaRepository.delete(ropa);
    ropaRepository.flush();

    // Limpiar las imágenes después de eliminar correctamente el producto.
    for (String imagen : imagenes) {
        if (imagen == null || imagen.isBlank()) {
            continue;
        }

        if (imagen.startsWith("https://res.cloudinary.com/")
                || imagen.startsWith("http://res.cloudinary.com/")) {
            try {
                storageService.eliminarImagenCloudinary(imagen);
            } catch (Exception e) {
                // El producto ya fue eliminado. Registrar el error
                // para poder limpiar la imagen posteriormente.
                System.err.println(
                        "No se pudo eliminar la imagen de Cloudinary: "
                        + imagen + ". Error: " + e.getMessage());
            }

        } else {
            String nombreArchivo = imagen.startsWith(URL_BASE)
                    ? imagen.substring(URL_BASE.length())
                    : imagen;

            try {
                Path ruta = storageService.resolverArchivo(nombreArchivo);
                Files.deleteIfExists(ruta);
            } catch (IOException e) {
                System.err.println(
                        "No se pudo eliminar la imagen local: "
                        + nombreArchivo + ". Error: " + e.getMessage());
            }
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
    if (r.getImagenesUrl() != null) {
        r.setImagenesUrl(
                r.getImagenesUrl().stream()
                        .map(this::resolverUrlImagen)
                        .collect(Collectors.toList())
        );
    }
});


        return lista;
    }
}
