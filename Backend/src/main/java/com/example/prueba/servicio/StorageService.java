package com.example.prueba.servicio;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Paths;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class StorageService {

    private final Path uploadDirectory;

    public StorageService(@Value("${app.uploads.dir:src/main/resources/static/uploads}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    public String guardarArchivo(MultipartFile archivo) throws IOException {

        Files.createDirectories(uploadDirectory);

        String nombreOriginal = archivo.getOriginalFilename() == null ? "archivo" : archivo.getOriginalFilename();
        nombreOriginal = nombreOriginal.replace('\\', '/');
        nombreOriginal = nombreOriginal.substring(nombreOriginal.lastIndexOf('/') + 1);
        String nombreArchivo = UUID.randomUUID() + "_" + nombreOriginal;

        Path ruta = resolverArchivo(nombreArchivo);

        Files.copy(archivo.getInputStream(), ruta);

        return nombreArchivo;
    }

    public Path getUploadDirectory() {
        return uploadDirectory;
    }

    public Path resolverArchivo(String nombreArchivo) {
        Path ruta = uploadDirectory.resolve(nombreArchivo).normalize();
        if (!ruta.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Nombre de archivo de imagen invalido");
        }
        return ruta;
    }
}