package com.example.prueba.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

class JwtServiceTest {

    @Test
    void signsAndValidatesTokensWithConfiguredSecret() {
        JwtService jwtService = new JwtService("test-only-signing-key-that-is-at-least-32-bytes");
        String token = jwtService.generarToken("comprador", "ROLE_USER", 42L);
        User user = new User("comprador", "not-used", java.util.List.of());

        assertEquals("comprador", jwtService.extraerUsername(token));
        assertEquals("ROLE_USER", jwtService.extraerRole(token));
        assertTrue(jwtService.validarToken(token, user));
        assertFalse(jwtService.validarToken(token, new User("otra-persona", "not-used", java.util.List.of())));
    }

    @Test
    void refusesMissingOrShortSigningSecrets() {
        assertThrows(IllegalStateException.class, () -> new JwtService(""));
        assertThrows(IllegalStateException.class, () -> new JwtService("too-short"));
    }
}
