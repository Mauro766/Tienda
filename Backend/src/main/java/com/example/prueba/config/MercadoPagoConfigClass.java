package com.example.prueba.config;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfigClass {

    @PostConstruct
    public void init() {
        String accessToken = System.getenv("ACCESS_TOKEN");

        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalStateException(
                    "Falta configurar la variable de entorno ACCESS_TOKEN"
            );
        }

        MercadoPagoConfig.setAccessToken(accessToken);
    }
}