package com.example.prueba;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.prueba.entity.Usuario;
import com.example.prueba.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class PruebaApplicationTests {

	private final AuthenticationManager authenticationManager;
	private final BCryptPasswordEncoder passwordEncoder;
	private final UsuarioRepository usuarioRepository;

	@Autowired
	PruebaApplicationTests(
			AuthenticationManager authenticationManager,
			BCryptPasswordEncoder passwordEncoder,
			UsuarioRepository usuarioRepository) {
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
		this.usuarioRepository = usuarioRepository;
	}

	@BeforeEach
	void cleanUsers() {
		usuarioRepository.deleteAll();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void authenticationManagerAcceptsValidUsernameAndEmailButRejectsWrongPassword() {
		Usuario usuario = new Usuario();
		usuario.setUsername("comprador");
		usuario.setCorreoElectronico("comprador@example.com");
		usuario.setPassword(passwordEncoder.encode("correct-password"));
		usuario.setRol("ROLE_USER");
		usuario.setActivo(true);
		usuarioRepository.saveAndFlush(usuario);

		Authentication byUsername = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken("comprador", "correct-password"));
		Authentication byEmail = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken("comprador@example.com", "correct-password"));

		assertNotNull(byUsername);
		assertNotNull(byEmail);
		assertThrows(BadCredentialsException.class, () -> authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken("comprador", "wrong-password")));

		usuario.setUsername("inactivo");
		usuario.setCorreoElectronico("inactivo@example.com");
		usuario.setActivo(false);
		usuarioRepository.saveAndFlush(usuario);
		assertThrows(DisabledException.class, () -> authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken("inactivo", "correct-password")));
	}
}
