package com.example.prueba.controller;

import com.example.prueba.dto.AuthUserResponse;
import com.example.prueba.dto.LoginRequest;
import com.example.prueba.entity.Usuario;
import com.example.prueba.repository.UsuarioRepository;
import com.example.prueba.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String DEFAULT_COOKIE_NAME = "auth_token";

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final String cookieName;
    private final boolean secureCookie;
    private final String sameSitePolicy;
    private final long cookieMaxAgeSeconds;

    public AuthController(AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            @Value("${app.auth.cookie.name:" + DEFAULT_COOKIE_NAME + "}") String cookieName,
            @Value("${app.auth.cookie.secure:false}") boolean secureCookie,
            @Value("${app.auth.cookie.same-site:Lax}") String sameSitePolicy,
            @Value("${app.auth.cookie.max-age-seconds:86400}") long cookieMaxAgeSeconds) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.cookieName = cookieName;
        this.secureCookie = secureCookie;
        this.sameSitePolicy = sameSitePolicy;
        this.cookieMaxAgeSeconds = cookieMaxAgeSeconds;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String loginId = normalizarLoginId(request.getLoginId());
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (loginId.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debes enviar login y password"));
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginId, password));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales invalidas"));
        }

        Usuario usuario = usuarioRepository.findByUsername(loginId)
                .or(() -> usuarioRepository.findByCorreoElectronico(loginId))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado post-auth"));

        String token = jwtService.generarToken(
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getId());

        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSitePolicy)
                .maxAge(cookieMaxAgeSeconds)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthUserResponse(usuario.getId(), usuario.getUsername(), usuario.getRol()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie deleteCookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSitePolicy)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(Map.of("message", "Sesion cerrada"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));
        }

        String username = authentication.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(new AuthUserResponse(usuario.getId(), usuario.getUsername(), usuario.getRol()));
    }

    private String normalizarLoginId(String loginId) {
        if (loginId == null) {
            return "";
        }

        String limpio = loginId.trim();
        if (limpio.contains("@")) {
            return limpio.toLowerCase(Locale.ROOT);
        }
        return limpio;
    }
}
