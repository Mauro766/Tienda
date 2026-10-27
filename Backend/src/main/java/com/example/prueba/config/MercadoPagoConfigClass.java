package com.example.prueba.config;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfigClass {

    private final String accessToken;

    public MercadoPagoConfigClass(@Value("${ACCESS_TOKEN:}") String accessToken) {
        this.accessToken = accessToken;
    }

    @PostConstruct
    public void init() {
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalStateException(
                    "Falta configurar la variable de entorno ACCESS_TOKEN"
            );
        }

        MercadoPagoConfig.setAccessToken(accessToken);
    }
}