package com.example.prueba.security;

import com.example.prueba.entity.Usuario;
import com.example.prueba.repository.UsuarioRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        String idNormalizado = normalizarLoginId(loginId);

        Usuario usuario = usuarioRepository.findByUsername(idNormalizado)
                .or(() -> usuarioRepository.findByCorreoElectronico(idNormalizado))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return User.withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(usuario.getRol())))
                .disabled(!Boolean.TRUE.equals(usuario.getActivo()))
                .build();
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
