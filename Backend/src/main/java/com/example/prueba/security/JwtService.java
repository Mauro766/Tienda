package com.example.prueba.security;

import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String SECRET_KEY = "clave_super_secreta_muy_larga_para_jwt_seguridad_2026";

    // 🔥 ahora recibe el rol
    public String generarToken(String username, String role) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // ✅ agregamos el rol
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
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
        return (username.equals(userDetails.getUsername()) && !tokenExpirado(token));
    }

    private Claims extraerTodosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
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