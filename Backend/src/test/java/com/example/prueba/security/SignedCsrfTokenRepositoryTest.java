package com.example.prueba.security;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;

class SignedCsrfTokenRepositoryTest {

    private static final String SECRET = "test-only-csrf-signing-key-that-is-at-least-32-bytes";

    @Test
    void acceptsOnlyAnUnmodifiedSignedHeaderToken() {
        SignedCsrfTokenRepository repository = new SignedCsrfTokenRepository(SECRET);
        CsrfToken issued = repository.generateToken(new MockHttpServletRequest());
        MockHttpServletRequest validRequest = requestWithHeader(issued.getToken());
        MockHttpServletRequest invalidRequest = requestWithHeader(issued.getToken() + "tampered");

        assertNotNull(repository.loadToken(validRequest));
        assertNull(repository.loadToken(invalidRequest));
        assertNull(repository.loadToken(new MockHttpServletRequest()));
    }

    private MockHttpServletRequest requestWithHeader(String token) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(SignedCsrfTokenRepository.HEADER_NAME, token);
        return request;
    }
}
