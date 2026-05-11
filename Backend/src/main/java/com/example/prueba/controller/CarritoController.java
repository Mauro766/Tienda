package com.example.prueba.controller;

import com.example.prueba.dto.SincronizarCarritoRequest;
import com.example.prueba.entity.Carrito;
import com.example.prueba.entity.Usuario;
import com.example.prueba.servicio.CarritoService;
import com.example.prueba.servicio.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/carrito")
public class CarritoController {

    private final CarritoService carritoService;
    private final UsuarioService usuarioService;

    public CarritoController(CarritoService carritoService, UsuarioService usuarioService) {
        this.carritoService = carritoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarItem(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            if (payload.get("ropaId") == null || payload.get("cantidad") == null) {
                return ResponseEntity.badRequest().body("Faltan datos obligatorios (ropaId o cantidad)");
            }

            Long usuarioId = obtenerUsuarioAutenticadoId(authentication);
            Long ropaId = Long.valueOf(payload.get("ropaId").toString());
            Integer cantidad = Integer.valueOf(payload.get("cantidad").toString());

            Carrito carrito = carritoService.agregarItem(usuarioId, ropaId, cantidad);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al agregar al carrito: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{itemId}")
    public Carrito eliminarItem(@PathVariable Long itemId, Authentication authentication) {
        Long usuarioId = obtenerUsuarioAutenticadoId(authentication);
        return carritoService.eliminarItem(usuarioId, itemId);
    }

    @GetMapping("/mio")
    public Carrito obtenerCarrito(Authentication authentication) {
        Long usuarioId = obtenerUsuarioAutenticadoId(authentication);
        return carritoService.obtenerCarrito(usuarioId);
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<?> sincronizar(@RequestBody SincronizarCarritoRequest request, Authentication authentication) {
        try {
            Long usuarioId = obtenerUsuarioAutenticadoId(authentication);
            Carrito carrito = carritoService.sincronizarCarrito(usuarioId, request.getItems());
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sincronizando: " + e.getMessage());
        }
    }

    private Long obtenerUsuarioAutenticadoId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        String username = authentication.getName();
        Usuario usuario = usuarioService.buscarPorUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return usuario.getId();
    }
}
