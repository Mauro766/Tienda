package com.example.prueba.servicio;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.prueba.dto.CrearPedidoDTO;
import com.example.prueba.dto.RopaDTO;
import com.example.prueba.entity.Carrito;
import com.example.prueba.entity.CarritoItem;
import com.example.prueba.entity.EstadoPedido;
import com.example.prueba.entity.Pedido;
import com.example.prueba.entity.PedidoItem;
import com.example.prueba.mapper.RopaMapper;
import com.example.prueba.repository.CarritoRepository;
import com.example.prueba.repository.PedidoRepository;
import com.example.prueba.entity.Ropa;
import com.example.prueba.repository.RopaRepository;

@Service
public class PedidoService {
    private static final String URL_BASE = "/uploads/";
    private final PedidoRepository pedidoRepository;
    private final CarritoRepository carritoRepository;
    private final RopaRepository ropaRepository;

    public PedidoService(PedidoRepository pedidoRepository, CarritoRepository carritoRepository, RopaRepository ropaRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carritoRepository = carritoRepository;
        this.ropaRepository = ropaRepository;
    }

    @Transactional
    public Pedido cambiarEstado(Long pedidoId, EstadoPedido nuevoEstado) {

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (nuevoEstado == null) {
            throw new RuntimeException("El estado es obligatorio");
        }

        EstadoPedido estadoActual = pedido.getEstado();
        if (estadoActual == EstadoPedido.CANCELADO && nuevoEstado != EstadoPedido.CANCELADO) {
            throw new RuntimeException("No se puede cambiar un pedido cancelado");
        }

        if (estadoActual != EstadoPedido.CANCELADO && nuevoEstado == EstadoPedido.CANCELADO) {
            devolverStock(pedido);
        }

        pedido.setEstado(nuevoEstado);

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido crearPedidoDesdeCarrito(Long usuarioId, CrearPedidoDTO dto) {

        // 1. Obtener carrito
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // 2. Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(carrito.getUsuario());
        pedido.setCiudad(dto.getCiudad());
        pedido.setDireccion(dto.getDireccion());
        pedido.setTelefono(dto.getTelefono());

        List<PedidoItem> itemsPedido = new ArrayList<>();

        // 3. Copiar items
        for (CarritoItem item : carrito.getItems()) {
            Ropa producto = validarYDescontarStock(item);

            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(pedido);
            pedidoItem.setProducto(producto);
            pedidoItem.setCantidad(item.getCantidad());
            pedidoItem.setPrecio(item.getPrecio());

            itemsPedido.add(pedidoItem);
        }

        pedido.setItems(itemsPedido);

        // 4. Calcular total
        BigDecimal total = itemsPedido.stream()
                .map(i -> i.getPrecio().multiply(BigDecimal.valueOf(i.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        pedido.setTotal(total);

        // 5. Guardar pedido
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // 6. Vaciar carrito
        carrito.getItems().clear();
        carrito.setTotal(BigDecimal.ZERO);
        carritoRepository.save(carrito);

        return pedidoGuardado;
    }

    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<Pedido> obtenerPedidosFiltrados(String ciudad, String direccion) {
        boolean tieneCiudad = ciudad != null && !ciudad.trim().isEmpty();
        boolean tieneDireccion = direccion != null && !direccion.trim().isEmpty();

        if (tieneCiudad && tieneDireccion) {
            return pedidoRepository.findByCiudadContainingIgnoreCaseAndDireccionContainingIgnoreCase(
                    ciudad.trim(),
                    direccion.trim());
        }

        if (tieneCiudad) {
            return pedidoRepository.findByCiudadContainingIgnoreCase(ciudad.trim());
        }

        if (tieneDireccion) {
            return pedidoRepository.findByDireccionContainingIgnoreCase(direccion.trim());
        }

        return pedidoRepository.findAll();
    }

    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<RopaDTO> obtenerProductosMasVendidos(int limite) {
        int limiteFinal = limite > 0 ? limite : 3;
        Pageable pageable = PageRequest.of(0, limiteFinal);

        return pedidoRepository
                .obtenerProductosMasVendidos(EstadoPedido.CANCELADO, pageable)
                .stream()
                .map(RopaMapper::toDTO)
                .peek(this::agregarPrefijoImagenes)
                .collect(Collectors.toList());
    }

    private Ropa validarYDescontarStock(CarritoItem item) {
        if (item.getCantidad() == null || item.getCantidad() <= 0) {
            throw new RuntimeException("Cantidad invalida en el carrito");
        }
        if (item.getProducto() == null || item.getProducto().getId() == null) {
            throw new RuntimeException("Producto invalido en el carrito");
        }

        Ropa producto = ropaRepository.findById(item.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stockActual = producto.getStock() == null ? 0 : producto.getStock();
        if (stockActual < item.getCantidad()) {
            throw new RuntimeException("No hay stock suficiente para " + producto.getNombre());
        }

        producto.setStock(stockActual - item.getCantidad());
        return producto;
    }

    private void devolverStock(Pedido pedido) {
        for (PedidoItem item : pedido.getItems()) {
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                continue;
            }
            if (item.getProducto() == null || item.getProducto().getId() == null) {
                continue;
            }

            Ropa producto = ropaRepository.findById(item.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado al devolver stock"));

            int stockActual = producto.getStock() == null ? 0 : producto.getStock();
            producto.setStock(stockActual + item.getCantidad());
        }


    }

    private void agregarPrefijoImagenes(RopaDTO dto) {
        if (dto.getImagenesUrl() == null || dto.getImagenesUrl().isEmpty()) {
            return;
        }

        dto.setImagenesUrl(dto.getImagenesUrl()
                .stream()
                .map(img -> img.startsWith(URL_BASE) ? img : URL_BASE + img)
                .collect(Collectors.toList()));
    }

}
