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
import com.example.prueba.servicio.MercadoPagoService;
import java.util.HashMap;
import java.util.Map;
import com.example.prueba.servicio.PedidoService;
import com.example.prueba.servicio.UsuarioService;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/pedido")
public class PedidoController {
    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);

    private final PedidoService pedidoService;
    private final UsuarioService usuarioService;
    private final MercadoPagoService mercadoPagoService;

    public PedidoController(PedidoService pedidoService, UsuarioService usuarioService,
            MercadoPagoService mercadoPagoService) {
        this.pedidoService = pedidoService;
        this.usuarioService = usuarioService;
        this.mercadoPagoService = mercadoPagoService;
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
    public Map<String, Object> checkout(
            @Valid @RequestBody CrearPedidoDTO dto,
            Authentication authentication) {

        String username = authentication.getName();

        Usuario usuario = usuarioService.buscarPorUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = pedidoService.crearPedidoDesdeCarrito(usuario.getId(), dto);
        String initPoint = null;
        if (pedido.getItems() != null && !pedido.getItems().isEmpty()) {
            try {
                initPoint = mercadoPagoService.crearPreferencia(pedido);
            } catch (com.mercadopago.exceptions.MPException | com.mercadopago.exceptions.MPApiException e) {
                logger.error("No se pudo crear la preferencia de pago para el pedido {}", pedido.getId(), e);
                throw new RuntimeException("Error al crear preferencia de pago", e);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("pedidoId", pedido.getId());
        response.put("initPoint", initPoint);
        return response;
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
