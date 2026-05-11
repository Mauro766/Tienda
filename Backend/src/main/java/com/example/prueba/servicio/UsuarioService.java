package com.example.prueba.servicio;

import com.example.prueba.dto.UsuarioDTO;
import com.example.prueba.entity.Usuario;
import com.example.prueba.exception.UserAlreadyExistsException;
import com.example.prueba.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        prepararUsuarioNuevo(usuario);
        validarUnicidad(usuario);
        usuario.setActivo(true);
        usuario.setRol("ROLE_USER");
        return usuarioRepository.save(usuario);
    }

    public Usuario crearAdmin(Usuario usuario) {
        prepararUsuarioNuevo(usuario);
        validarUnicidad(usuario);
        usuario.setActivo(true);
        usuario.setRol("ROLE_ADMIN");
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public UsuarioDTO buscarDTOPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toDTO(usuario);
    }

    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public List<UsuarioDTO> listarUsuariosDTO() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public void activarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setCorreoElectronico(usuario.getCorreoElectronico());
        dto.setRol(usuario.getRol());
        dto.setActivo(usuario.getActivo());
        return dto;
    }

    private void prepararUsuarioNuevo(Usuario usuario) {
        if (usuario == null) {
            throw new RuntimeException("Datos de usuario invalidos");
        }

        String username = normalizarTexto(usuario.getUsername());
        String correoElectronico = normalizarCorreo(usuario.getCorreoElectronico());
        String password = usuario.getPassword();

        if (username.isBlank()) {
            throw new RuntimeException("El username es obligatorio");
        }
        if (correoElectronico.isBlank()) {
            throw new RuntimeException("El correoElectronico es obligatorio");
        }
        if (password == null || password.isBlank()) {
            throw new RuntimeException("La password es obligatoria");
        }

        usuario.setUsername(username);
        usuario.setCorreoElectronico(correoElectronico);
        usuario.setPassword(passwordEncoder.encode(password));
    }

    private void validarUnicidad(Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("El username ya existe");
        }

        if (usuarioRepository.findByCorreoElectronico(usuario.getCorreoElectronico()).isPresent()) {
            throw new UserAlreadyExistsException("El correoElectronico ya existe");
        }
    }

    private String normalizarTexto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private String normalizarCorreo(String valor) {
        return normalizarTexto(valor).toLowerCase(Locale.ROOT);
    }
}
