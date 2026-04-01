package com.example.prueba.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.prueba.security.JwtService;
import com.example.prueba.dto.LoginRequest;
import com.example.prueba.dto.LoginResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        // 🔐 autentica usuario
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 🔥 obtiene usuario real con roles
        UserDetails userDetails = userDetailsService
                .loadUserByUsername(request.getUsername());

        // 🔥 obtiene el rol
        String role = userDetails.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // 🔥 genera token con rol
        String token = jwtService.generarToken(request.getUsername(), role);

        return new LoginResponse(token);
    }
}