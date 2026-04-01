package com.example.prueba.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.prueba.dto.RopaCreateDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.dto.RopaUpdateDTO;
import com.example.prueba.servicio.RopaService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ropa")
public class RopaController {

    private final RopaService ropaService;

    public RopaController(RopaService ropaService) {
        this.ropaService = ropaService;
    }

    // 🔹 Crear ropa (POST)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = "multipart/form-data")
    public RopaDTO crear(
            @Valid @RequestPart("ropa") RopaCreateDTO dto,
            @RequestPart(value = "imagenes", required = false) List<MultipartFile> imagenes) throws Exception {

        return ropaService.crear(dto, imagenes);
    }

    // 🔹 Listar todas las ropas activas
    @GetMapping
    public Page<RopaDTO> listar(
            @RequestParam(required = false) String nombre,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {

        return ropaService.listar(nombre, pageable);
    }

    // Busca prendas por nombre y devuelve resultados paginados
    @GetMapping("/buscar")
    public Page<RopaDTO> buscar(
            @RequestParam String nombre,
            Pageable pageable) {
        return ropaService.buscarPorNombre(nombre, pageable);
    }

    @GetMapping("/filtrar")
    public Page<RopaDTO> filtrar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            Pageable pageable) {

        return ropaService.filtrar(
                nombre,
                categoria,
                precioMin,
                precioMax,
                pageable);
    }

    // Lista todos sin importar si est activo o no solo para admin
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<RopaDTO> listarTodos() {
        return ropaService.listarTodos();
    }

    // 🔹 Buscar por ID
    @GetMapping("/id/{id}")
    public RopaDTO buscarPorId(@PathVariable Long id) {
        return ropaService.buscarPorId(id);
    }

    // 🔹 Actualizar (PUT)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public RopaDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody RopaUpdateDTO dto) {

        return ropaService.actualizar(id, dto);
    }

    // 🔹 desactivar ropa
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Long id) {
        ropaService.desactivar(id);
    }

    // 🔹 activar ropa
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reactivar/{id}")
    public void activar(@PathVariable Long id) {
        ropaService.activar(id);
    }

    // Borrar el producto definitivamente
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ropaService.eliminar(id);
    }
}
