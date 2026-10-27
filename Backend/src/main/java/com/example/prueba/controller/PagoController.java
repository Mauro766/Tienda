package com.example.prueba.controller;

import com.example.prueba.entity.Pedido;
import com.example.prueba.servicio.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/pagos")
public class PagoController {

    private static final Logger logger = LoggerFactory.getLogger(PagoController.class);

    private final PedidoService pedidoService;
    private final SimpMessagingTemplate messagingTemplate;

    public PagoController(PedidoService pedidoService, SimpMessagingTemplate messagingTemplate) {
        this.pedidoService = pedidoService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * MercadoPago redirige aqui cuando el pago fue exitoso.
     * Recibe: collection_status (o status), external_reference (pedidoId).
     * Si el pago es approved, emite el pedido por WebSocket al panel admin
     * y redirige al frontend a la pagina de exito.
     */
    @GetMapping("/success")
    public RedirectView success(
            @RequestParam(value = "collection_status", required = false) String collectionStatus,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "external_reference", required = false) String externalReference) {

        String estadoFinal = collectionStatus != null ? collectionStatus : status;
        logger.info("[Pago] Retorno de MP - status: {}, external_reference: {}", estadoFinal, externalReference);

        if ("approved".equalsIgnoreCase(estadoFinal) && externalReference != null) {
            try {
                Long pedidoId = Long.parseLong(externalReference);
                Pedido pedido = pedidoService.obtenerPorId(pedidoId);
                messagingTemplate.convertAndSend("/topic/pedidos", pedido);
                logger.info("[WS] Pedido {} emitido al panel admin tras pago aprobado", pedidoId);
            } catch (Exception e) {
                logger.error("[Pago] Error al emitir pedido por WS tras pago aprobado: {}", e.getMessage(), e);
            }
        }

        // Redirigir al frontend - pagina principal
        return new RedirectView("http://localhost:5173/");
    }

    @GetMapping("/failure")
    public RedirectView failure() {
        logger.info("[Pago] Pago fallido");
        return new RedirectView("http://localhost:5173/");
    }

    @GetMapping("/pending")
    public RedirectView pending() {
        logger.info("[Pago] Pago pendiente");
        return new RedirectView("http://localhost:5173/");
    }
}
