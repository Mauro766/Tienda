
package com.example.prueba.servicio;

import com.example.prueba.dto.PackCreateDTO;
import com.example.prueba.dto.PackDTO;
import com.example.prueba.dto.PackUpdateDTO;
import com.example.prueba.entity.Pack;
import com.example.prueba.entity.Ropa;
import com.example.prueba.entity.RopaImagen;
import com.example.prueba.repository.PackRepository;
import com.example.prueba.repository.RopaRepository;
import com.example.prueba.servicio.StorageService;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PackService {

    private final PackRepository packRepository;
    private final RopaRepository ropaRepository;
    private final StorageService storageService;

    public PackService(
            PackRepository packRepository,
            RopaRepository ropaRepository,
            StorageService storageService) {
        this.packRepository = packRepository;
        this.ropaRepository = ropaRepository;
        this.storageService = storageService;
    }

    @Transactional
    public PackDTO crear(PackCreateDTO dto, MultipartFile imagen) {
        validarPrendas(dto.getRopaSuperiorId(), dto.getRopaInferiorId());

        if (imagen == null || imagen.isEmpty()) {
            throw new IllegalArgumentException(
                    "Debes subir una imagen del pack");
        }

        Ropa superior = obtenerPrendaActiva(dto.getRopaSuperiorId());
        Ropa inferior = obtenerPrendaActiva(dto.getRopaInferiorId());

        String imagenUrl;

try {
    imagenUrl = storageService.guardarArchivo(imagen);
} catch (IOException e) {
    throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "No se pudo guardar la imagen del pack",
            e
    );
}

        Pack pack = new Pack();
        pack.setNombre(dto.getNombre());
        pack.setDescripcion(dto.getDescripcion());
        pack.setImagenUrl(imagenUrl);
        pack.setRopaSuperior(superior);
        pack.setRopaInferior(inferior);
        pack.setPrecioPack(dto.getPrecioPack());
        pack.setActivo(true);

        return convertirDTO(packRepository.save(pack));
    }

    @Transactional
    public PackDTO actualizar(
            Long id,
            PackUpdateDTO dto,
            MultipartFile imagen) {

        Pack pack = packRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("El pack no existe"));

        validarPrendas(dto.getRopaSuperiorId(), dto.getRopaInferiorId());

        Ropa superior = obtenerPrendaActiva(dto.getRopaSuperiorId());
        Ropa inferior = obtenerPrendaActiva(dto.getRopaInferiorId());

        pack.setNombre(dto.getNombre());
        pack.setDescripcion(dto.getDescripcion());
        pack.setRopaSuperior(superior);
        pack.setRopaInferior(inferior);
        pack.setPrecioPack(dto.getPrecioPack());

        if (dto.getActivo() != null) {
            pack.setActivo(dto.getActivo());
        }

        String imagenAnterior = pack.getImagenUrl();

        if (imagen != null && !imagen.isEmpty()) {
           try {
    pack.setImagenUrl(storageService.guardarArchivo(imagen));
} catch (IOException e) {
    throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "No se pudo actualizar la imagen del pack",
            e
    );
}
        }

        Pack guardado = packRepository.save(pack);

        // Si se reemplazó la imagen, intentamos eliminar la anterior.
        if (imagen != null && !imagen.isEmpty()
                && imagenAnterior != null
                && !imagenAnterior.equals(guardado.getImagenUrl())) {
            try {
                storageService.eliminarImagenCloudinary(imagenAnterior);
            } catch (Exception e) {
                // El pack ya está guardado; un fallo al borrar la imagen
                // anterior no debe cancelar la actualización.
            }
        }

        return convertirDTO(guardado);
    }

    @Transactional(readOnly = true)
    public List<PackDTO> listarActivos() {
        return packRepository.findByActivoTrue()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PackDTO> listarTodos() {
        return packRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public PackDTO buscarActivoPorId(Long id) {
        Pack pack = packRepository.findById(id)
                .filter(Pack::getActivo)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El pack no existe o está inactivo"));

        return convertirDTO(pack);
    }

    @Transactional
    public void desactivar(Long id) {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("El pack no existe"));

        pack.setActivo(false);
        packRepository.save(pack);
    }

    private Ropa obtenerPrendaActiva(Long id) {
        return ropaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No existe una prenda activa con ID " + id));
    }

    private void validarPrendas(Long superiorId, Long inferiorId) {
        if (superiorId == null || inferiorId == null) {
            throw new IllegalArgumentException(
                    "Debes seleccionar ambas prendas");
        }

        if (superiorId.equals(inferiorId)) {
            throw new IllegalArgumentException(
                    "El pack debe tener dos prendas diferentes");
        }
    }

    private PackDTO convertirDTO(Pack pack) {
        Ropa superior = pack.getRopaSuperior();
        Ropa inferior = pack.getRopaInferior();

        BigDecimal precioSuperior = superior.getPrecio();
        BigDecimal precioInferior = inferior.getPrecio();

        BigDecimal precioTotal = precioSuperior.add(precioInferior);

        PackDTO dto = new PackDTO();
        dto.setId(pack.getId());
        dto.setNombre(pack.getNombre());
        dto.setDescripcion(pack.getDescripcion());
        dto.setImagenUrl(pack.getImagenUrl());
        dto.setPrecioPack(pack.getPrecioPack());
        dto.setPrecioTotalPrendas(precioTotal);
        dto.setActivo(pack.getActivo());
        dto.setFechaCreacion(pack.getFechaCreacion());

        dto.setRopaSuperiorId(superior.getId());
        dto.setRopaSuperiorNombre(superior.getNombre());
        dto.setRopaSuperiorPrecio(precioSuperior);
        dto.setRopaSuperiorImagen(obtenerImagenPrenda(superior));

        dto.setRopaInferiorId(inferior.getId());
        dto.setRopaInferiorNombre(inferior.getNombre());
        dto.setRopaInferiorPrecio(precioInferior);
        dto.setRopaInferiorImagen(obtenerImagenPrenda(inferior));

        return dto;
    }

    private String obtenerImagenPrenda(Ropa ropa) {
        if (ropa.getImagenesUrl() == null
                || ropa.getImagenesUrl().isEmpty()) {
            return null;
        }

        RopaImagen imagen = ropa.getImagenesUrl().get(0);
        return imagen != null ? imagen.getImagenUrl() : null;
    }
}
