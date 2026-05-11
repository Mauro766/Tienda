package com.example.prueba.servicio;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.prueba.entity.Carrito;
import com.example.prueba.entity.CarritoItem;
import com.example.prueba.entity.Ropa;
import com.example.prueba.entity.Usuario;
import com.example.prueba.repository.CarritoRepository;
import com.example.prueba.repository.RopaRepository;
import com.example.prueba.repository.UsuarioRepository;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RopaRepository ropaRepository;

    public CarritoService(CarritoRepository carritoRepository, UsuarioRepository usuarioRepository,
            RopaRepository ropaRepository) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.ropaRepository = ropaRepository;
    }

    public Carrito obtenerCarrito(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    Carrito carrito = new Carrito();
                    carrito.setUsuario(usuario);
                    return carritoRepository.save(carrito);
                });
    }

    public Carrito agregarItem(Long usuarioId, Long ropaId, int cantidad) {
        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        Carrito carrito = obtenerCarrito(usuarioId);
        Ropa ropa = ropaRepository.findById(ropaId)
                .orElseThrow(() -> new RuntimeException("Ropa no encontrada"));
        int stockDisponible = ropa.getStock() == null ? 0 : ropa.getStock();

        // Verificar si el item ya existe en el carrito
        CarritoItem itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(ropaId))
                .findFirst()
                .orElse(null);

        if (itemExistente != null) {
            // Actualizar cantidad
            int nuevaCantidad = itemExistente.getCantidad() + cantidad;
            if (stockDisponible < nuevaCantidad) {
                throw new RuntimeException("No hay stock suficiente");
            }
            itemExistente.setCantidad(nuevaCantidad);
        } else {
            // Agregar nuevo item
            if (stockDisponible < cantidad) {
                throw new RuntimeException("No hay stock suficiente");
            }
            CarritoItem nuevoItem = new CarritoItem();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(ropa);
            nuevoItem.setCantidad(cantidad);
            nuevoItem.setPrecio(ropa.getPrecio());
            carrito.getItems().add(nuevoItem);
        }

        // Recalcular total
        BigDecimal total = carrito.getItems().stream()
                .map(item -> item.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        carrito.setTotal(total);

        return carritoRepository.save(carrito);
    }

    public Carrito eliminarItem(Long usuarioId, Long itemId) {
        Carrito carrito = obtenerCarrito(usuarioId);

        // Eliminar item del carrito
        carrito.getItems().removeIf(item ->
    item.getId().equals(itemId) && item.getCarrito().getId().equals(carrito.getId())
);

        // Recalcular total
        BigDecimal total = carrito.getItems().stream()
                .map(item -> item.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        carrito.setTotal(total);

        return carritoRepository.save(carrito);
    }

    /**
     * Sincroniza múltiples ítems al carrito (útil tras el login).
     */
    public Carrito sincronizarCarrito(Long usuarioId, List<com.example.prueba.dto.SincronizarCarritoRequest.ItemSincronizable> items) {
        if (items == null || items.isEmpty()) return obtenerCarrito(usuarioId);
        
        for (com.example.prueba.dto.SincronizarCarritoRequest.ItemSincronizable item : items) {
            try {
                agregarItem(usuarioId, item.getRopaId(), item.getCantidad());
            } catch (Exception e) {
                // Si falla un item (ej: sin stock), seguimos con los demás
                System.err.println("Error sincronizando ropaId " + item.getRopaId() + ": " + e.getMessage());
            }
        }
        return obtenerCarrito(usuarioId);
    }

}
