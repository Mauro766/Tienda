
package com.example.prueba.servicio;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.net.URI;

@Service
public class StorageService {

    private final Path uploadDirectory;
    private final Cloudinary cloudinary;

    public StorageService(
            @Value("${app.uploads.dir:src/main/resources/static/uploads}")
            String uploadDirectory,
            @Value("${CLOUDINARY_CLOUD_NAME}") String cloudName,
            @Value("${CLOUDINARY_API_KEY}") String apiKey,
            @Value("${CLOUDINARY_API_SECRET}") String apiSecret) {

        this.uploadDirectory = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    public String guardarArchivo(MultipartFile archivo) throws IOException {

        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        String contentType = archivo.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        Map<?, ?> resultado = cloudinary.uploader().upload(
                archivo.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", "tienda/ropa",
                        "public_id", UUID.randomUUID().toString()
                )
        );

        Object url = resultado.get("secure_url");

        if (url == null) {
            throw new IOException("Cloudinary no devolvió la URL de la imagen");
        }

        return url.toString();
    }

    public Path getUploadDirectory() {
        return uploadDirectory;
    }

    public Path resolverArchivo(String nombreArchivo) {
        Path ruta = uploadDirectory.resolve(nombreArchivo).normalize();

        if (!ruta.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException(
                    "Nombre de archivo de imagen inválido");
        }

        return ruta;
    }

    
public void eliminarImagenCloudinary(String urlImagen) throws Exception {
    if (urlImagen == null || urlImagen.isBlank()) {
        return;
    }

    // Si no es una URL de Cloudinary, no hacemos nada.
    URI uri = URI.create(urlImagen);
    String host = uri.getHost();

    if (host == null || !host.equalsIgnoreCase("res.cloudinary.com")) {
        return;
    }

    String path = uri.getPath();
    String marcador = "/image/upload/";
    int inicio = path.indexOf(marcador);

    if (inicio == -1) {
        throw new IllegalArgumentException(
                "La URL no tiene el formato esperado de Cloudinary");
    }

    String publicIdConVersion = path.substring(
            inicio + marcador.length()
    );

    // Quitar la versión, por ejemplo v1793194735/
    if (publicIdConVersion.matches("^v\\d+/.+")) {
        publicIdConVersion = publicIdConVersion.replaceFirst("^v\\d+/", "");
    }

    // Quitar la extensión .webp, .jpg, .png, etc.
    int extension = publicIdConVersion.lastIndexOf('.');
    if (extension > publicIdConVersion.lastIndexOf('/')) {
        publicIdConVersion = publicIdConVersion.substring(0, extension);
    }

    Map<?, ?> resultado = cloudinary.uploader().destroy(
            publicIdConVersion,
            ObjectUtils.asMap("resource_type", "image")
    );

    if (!"ok".equals(resultado.get("result"))
            && !"not found".equals(resultado.get("result"))) {
        throw new IOException(
                "Cloudinary no pudo eliminar la imagen: " + resultado
        );
    }
}


}
