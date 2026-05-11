package com.example.prueba.dto;

public class AuthUserResponse {

    private Long id;
    private String username;
    private String rol;

    public AuthUserResponse() {
    }

    public AuthUserResponse(Long id, String username, String rol) {
        this.id = id;
        this.username = username;
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
