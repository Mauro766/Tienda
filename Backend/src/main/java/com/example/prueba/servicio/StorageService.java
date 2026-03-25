package com.example.prueba.servicio;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

// import io.swagger.v3.oas.models.Paths; // Remove this import
import java.nio.file.Paths;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class StorageService {

    private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public String guardarArchivo(MultipartFile archivo) throws IOException {

    File directorio = new File(UPLOAD_DIR);

    if (!directorio.exists()) {
        directorio.mkdirs();
    }

    String nombreArchivo = UUID.randomUUID() + "_" + archivo.getOriginalFilename();

    Path ruta = Paths.get(UPLOAD_DIR + nombreArchivo);

    Files.copy(archivo.getInputStream(), ruta);

    return nombreArchivo;
}
}