package com.example.prueba.servicio;

import com.example.prueba.entity.Pedido;
import com.example.prueba.entity.PedidoItem;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MercadoPagoService {
    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoService.class);

    private final String backendUrl;

    public MercadoPagoService(@Value("${app.backend.url:http://localhost:8081}") String backendUrl) {
        this.backendUrl = backendUrl.replaceAll("/+$", "");
    }

    public String crearPreferencia(Pedido pedido) throws MPException, MPApiException {
        if (pedido == null || pedido.getItems() == null || pedido.getItems().isEmpty()) {
            throw new RuntimeException("El pedido no tiene productos para pagar");
        }

        List<PreferenceItemRequest> items = new ArrayList<>();

        for (PedidoItem item : pedido.getItems()) {
            if (item.getProducto() == null || item.getProducto().getNombre() == null) {
                throw new RuntimeException("Hay productos invalidos en el pedido");
            }
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("Hay cantidades invalidas en el pedido");
            }
            if (item.getPrecio() == null) {
                throw new RuntimeException("Hay precios invalidos en el pedido");
            }

            items.add(PreferenceItemRequest.builder()
                    .title(item.getProducto().getNombre())
                    .quantity(item.getCantidad())
                    .unitPrice(item.getPrecio())
                    .currencyId("ARS")
                    .build());
        }

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .externalReference(String.valueOf(pedido.getId()))
                .backUrls(
                        PreferenceBackUrlsRequest.builder()
                                .success(backendUrl + "/pagos/success")
                                .failure(backendUrl + "/pagos/failure")
                                .pending(backendUrl + "/pagos/pending")
                                .build())
                .build();

        try {
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getInitPoint();
        } catch (MPApiException e) {
            logger.error("Mercado Pago devolvio un error API al crear la preferencia. Status: {}, respuesta: {}",
                    e.getStatusCode(), e.getApiResponse() != null ? e.getApiResponse().getContent() : "sin detalle", e);
            throw e;
        } catch (MPException e) {
            logger.error("Fallo la comunicacion con Mercado Pago al crear la preferencia", e);
            throw e;
        }
    }
}
