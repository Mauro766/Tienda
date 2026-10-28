package com.example.prueba.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.DefaultCsrfToken;

public class SignedCsrfTokenRepository implements CsrfTokenRepository {

    public static final String HEADER_NAME = "X-XSRF-TOKEN";
    private static final String PARAMETER_NAME = "_csrf";
    private static final long TOKEN_TTL_SECONDS = 60 * 60;
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final SecretKeySpec signingKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public SignedCsrfTokenRepository(String secret) {
        byte[] key = secret.getBytes(StandardCharsets.UTF_8);
        if (key.length < 32) {
            throw new IllegalStateException("APP_AUTH_CSRF_SECRET debe contener al menos 32 bytes");
        }
        this.signingKey = new SecretKeySpec(key, HMAC_ALGORITHM);
    }

    @Override
    public CsrfToken generateToken(HttpServletRequest request) {
        byte[] nonce = new byte[32];
        secureRandom.nextBytes(nonce);

        String encodedNonce = Base64.getUrlEncoder().withoutPadding().encodeToString(nonce);
        long expiresAt = Instant.now().getEpochSecond() + TOKEN_TTL_SECONDS;
        String payload = encodedNonce + "." + expiresAt;
        String signature = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(sign(payload.getBytes(StandardCharsets.UTF_8)));

        return new DefaultCsrfToken(HEADER_NAME, PARAMETER_NAME, payload + "." + signature);
    }

    @Override
    public CsrfToken loadToken(HttpServletRequest request) {
        String token = request.getHeader(HEADER_NAME);
        if (!isValid(token)) {
            return null;
        }
        return new DefaultCsrfToken(HEADER_NAME, PARAMETER_NAME, token);
    }

    @Override
    public void saveToken(CsrfToken token, HttpServletRequest request, HttpServletResponse response) {
        // Tokens are stateless and are supplied in the request header.
    }

    private boolean isValid(String token) {
        if (token == null) {
            return false;
        }

        String[] parts = token.split("\\.", -1);
        if (parts.length != 3 || parts[0].isBlank()) {
            return false;
        }

        try {
            long expiresAt = Long.parseLong(parts[1]);
            if (expiresAt <= Instant.now().getEpochSecond()
                    || expiresAt > Instant.now().getEpochSecond() + TOKEN_TTL_SECONDS) {
                return false;
            }

            byte[] suppliedSignature = Base64.getUrlDecoder().decode(parts[2]);
            byte[] expectedSignature = sign((parts[0] + "." + parts[1]).getBytes(StandardCharsets.UTF_8));
            return MessageDigest.isEqual(expectedSignature, suppliedSignature);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private byte[] sign(byte[] payload) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(signingKey);
            return mac.doFinal(payload);
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo generar el token CSRF", ex);
        }
    }
}
