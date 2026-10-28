
package com.example.prueba.controller;

import com.example.prueba.dto.PackCreateDTO;
import com.example.prueba.dto.PackDTO;
import com.example.prueba.dto.PackUpdateDTO;
import com.example.prueba.servicio.PackService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/packs")
public class PackController {

    private final PackService packService;

    public PackController(PackService packService) {
        this.packService = packService;
    }

    // PÚBLICO: listar packs activos
    @GetMapping
    public List<PackDTO> listarActivos() {
        return packService.listarActivos();
    }

    // PÚBLICO: ver un pack activo
    @GetMapping("/{id}")
    public PackDTO buscarPorId(@PathVariable Long id) {
        try {
            return packService.buscarActivoPorId(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ADMIN: listar todos, incluso los inactivos
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<PackDTO> listarTodos() {
        return packService.listarTodos();
    }

    // ADMIN: crear pack con imagen y datos
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PackDTO crear(
            @Valid @RequestPart("pack") PackCreateDTO dto,
            @RequestPart("imagen") MultipartFile imagen) {
        try {
            return packService.crear(dto, imagen);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ADMIN: actualizar datos y, opcionalmente, la imagen
    @PutMapping(value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public PackDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestPart("pack") PackUpdateDTO dto,
            @RequestPart(value = "imagen", required = false)
            MultipartFile imagen) {
        try {
            return packService.actualizar(id, dto, imagen);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ADMIN: desactivar sin borrar el registro
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long id) {
        try {
            packService.desactivar(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
