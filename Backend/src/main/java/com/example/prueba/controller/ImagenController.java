package com.example.prueba.controller;

import com.example.prueba.servicio.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/imagenes")
public class ImagenController {

    private final StorageService storageService;

    public ImagenController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/{nombreImagen}")
    public ResponseEntity<Resource> verImagen(@PathVariable String nombreImagen) {

        try {

            Path rutaImagen = storageService.resolverArchivo(nombreImagen);
            Resource recurso = new UrlResource(rutaImagen.toUri());

            if (!recurso.exists() || !recurso.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(rutaImagen);

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(recurso);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}