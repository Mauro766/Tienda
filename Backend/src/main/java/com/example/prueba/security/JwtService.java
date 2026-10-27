package com.example.prueba.security;

import java.util.Date;
import java.util.function.Function;
import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${app.auth.jwt.secret:}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("APP_AUTH_JWT_SECRET debe contener al menos 32 bytes");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(String username, String role, Long id) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("id", id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(signingKey)
                .compact();
    }

    public String extraerUsername(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    // 🔥 nuevo método
    public String extraerRole(String token) {
        return extraerClaim(token, claims -> claims.get("role", String.class));
    }

    public boolean validarToken(String token, UserDetails userDetails) {
        final String username = extraerUsername(token);
        return (username != null && username.equals(userDetails.getUsername()) && !tokenExpirado(token));
    }

    private Claims extraerTodosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extraerTodosClaims(token);
        return resolver.apply(claims);
    }

    private boolean tokenExpirado(String token) {
        return extraerClaim(token, Claims::getExpiration).before(new Date());
    }
}