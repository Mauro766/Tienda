package com.example.prueba.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/imagenes")
public class ImagenController {

    private final Path carpetaUploads = Paths.get("src/main/resources/static/uploads");
    @GetMapping("/{nombreImagen}")
    public ResponseEntity<Resource> verImagen(@PathVariable String nombreImagen) {

        try {

            Path rutaImagen = carpetaUploads.resolve(nombreImagen).normalize();
            Resource recurso = new UrlResource(rutaImagen.toUri());

            if (!recurso.exists()) {
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