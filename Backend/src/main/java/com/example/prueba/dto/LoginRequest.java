package com.example.prueba.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class LoginRequest {

    private String username;

    @JsonAlias({ "correo", "email" })
    private String correoElectronico;

    private String password;

    public LoginRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLoginId() {
        if (username != null && !username.isBlank()) {
            return username.trim();
        }
        if (correoElectronico != null && !correoElectronico.isBlank()) {
            return correoElectronico.trim();
        }
        return "";
    }
}
