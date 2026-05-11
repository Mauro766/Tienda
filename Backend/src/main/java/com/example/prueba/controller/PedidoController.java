package com.example.prueba.controller;

import org.springframework.security.core.Authentication;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.prueba.dto.CambiarEstadoDTO;
import com.example.prueba.dto.CrearPedidoDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.entity.Pedido;
import com.example.prueba.entity.Usuario;
import com.example.prueba.servicio.PedidoService;
import com.example.prueba.servicio.UsuarioService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoService pedidoService;
    private final UsuarioService usuarioService;

    public PedidoController(PedidoService pedidoService, UsuarioService usuarioService) {
        this.pedidoService = pedidoService;
        this.usuarioService = usuarioService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/estado")
    public Pedido cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambiarEstadoDTO dto) {

        return pedidoService.cambiarEstado(id, dto.getEstado());
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/checkout")
    public Pedido checkout(
            @Valid @RequestBody CrearPedidoDTO dto,
            Authentication authentication) {

        String username = authentication.getName();

        Usuario usuario = usuarioService.buscarPorUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return pedidoService.crearPedidoDesdeCarrito(usuario.getId(), dto);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mis-pedidos")
    public List<Pedido> misPedidos(Authentication authentication) {

        String username = authentication.getName();

        Usuario usuario = usuarioService.buscarPorUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return pedidoService.obtenerPedidosPorUsuario(usuario.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<Pedido> todosLosPedidos(
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) String direccion) {
        return pedidoService.obtenerPedidosFiltrados(ciudad, direccion);
    }

    @GetMapping("/mas-vendidos")
    public List<RopaDTO> obtenerMasVendidos(
            @RequestParam(defaultValue = "3") int limite) {
        return pedidoService.obtenerProductosMasVendidos(limite);
    }
}
