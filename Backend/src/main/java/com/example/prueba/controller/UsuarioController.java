package com.example.prueba.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.prueba.entity.*;
import com.example.prueba.servicio.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

     // 🔓 Registro público
    @PostMapping("/auth/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    // 🔒 Solo ADMIN
    @PostMapping("/admin/usuarios")
    public Usuario crearAdmin(@RequestBody Usuario usuario) {
        return usuarioService.crearAdmin(usuario);
    }
    // 🔹 Listar usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // 🔹 Buscar por username
    @GetMapping("/buscar/{username}")
    public Usuario buscarPorUsername(@PathVariable String username) {
        return usuarioService.buscarPorUsername(username);
    }

    // 🔹 Desactivar usuario
    @PutMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
    }

    // 🔹 Activar usuario
    @PutMapping("/activar/{id}")
    public void activar(@PathVariable Long id) {
        usuarioService.activarUsuario(id);
    }

    // Usuario Auntenticado
    @GetMapping("/me")
    public Map<String, Object> usuarioActual(Authentication authentication) {

        Map<String, Object> datos = new HashMap<>();

        datos.put("usuario", authentication.getName());
        datos.put("roles", authentication.getAuthorities());

        return datos;
    }

}