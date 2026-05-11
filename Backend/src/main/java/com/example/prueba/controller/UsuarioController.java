package com.example.prueba.controller;

import com.example.prueba.dto.UsuarioDTO;
import com.example.prueba.entity.Usuario;
import com.example.prueba.servicio.UsuarioService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/auth/register")
    public UsuarioDTO registrar(@RequestBody Usuario usuario) {
        Usuario usuarioCreado = usuarioService.registrarUsuario(usuario);
        return usuarioService.toDTO(usuarioCreado);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/usuarios")
    public UsuarioDTO crearAdmin(@RequestBody Usuario usuario) {
        Usuario adminCreado = usuarioService.crearAdmin(usuario);
        return usuarioService.toDTO(adminCreado);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioService.listarUsuariosDTO();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/buscar/{username}")
    public UsuarioDTO buscarPorUsername(@PathVariable String username) {
        return usuarioService.buscarDTOPorUsername(username);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activar/{id}")
    public void activar(@PathVariable Long id) {
        usuarioService.activarUsuario(id);
    }
}
