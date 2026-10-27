package com.example.prueba.security;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import com.example.prueba.controller.AuthController;
import com.example.prueba.controller.ImagenController;
import com.example.prueba.controller.RopaController;
import com.example.prueba.controller.UsuarioController;
import com.example.prueba.dto.UsuarioDTO;
import com.example.prueba.entity.Usuario;
import com.example.prueba.repository.UsuarioRepository;
import com.example.prueba.servicio.RopaService;
import com.example.prueba.servicio.StorageService;
import com.example.prueba.servicio.UsuarioService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@WebMvcTest(controllers = {
        AuthController.class,
        UsuarioController.class,
        RopaController.class,
        ImagenController.class
}, properties = "app.cors.allowed-origins=https://tienda-eight-chi.vercel.app")
@Import({ SecurityConfig.class, JwtFilter.class, StorageService.class })
class SecurityFlowTest {

    private static final Path TEST_UPLOAD_DIRECTORY = Paths.get(
            System.getProperty("java.io.tmpdir"),
            "tienda-security-flow-uploads");

    @DynamicPropertySource
    static void uploadDirectory(DynamicPropertyRegistry registry) {
        registry.add("app.uploads.dir", TEST_UPLOAD_DIRECTORY::toString);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FilterRegistrationBean<JwtFilter> jwtFilterServletRegistration;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private RopaService ropaService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @BeforeEach
    void configureJwtFixtures() {
        Usuario usuario = usuario();
        UserDetails userDetails = User.withUsername("comprador")
                .password("not-used")
                .authorities("ROLE_USER")
                .build();

        when(jwtService.extraerUsername("jwt-valido")).thenReturn("comprador");
        when(jwtService.validarToken(eq("jwt-valido"), any(UserDetails.class))).thenReturn(true);
        when(usuarioDetailsService.loadUserByUsername("comprador")).thenReturn(userDetails);
        when(usuarioRepository.findByUsername("comprador")).thenReturn(Optional.of(usuario));
    }

    @Test
    void jwtFilterIsOnlyRegisteredInsideSpringSecurity() {
        assertFalse(jwtFilterServletRegistration.isEnabled());
    }

    @Test
    void currentUserRequiresValidJwtAndReturnsTheAuthenticatedUser() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHENTICATED"));

        mockMvc.perform(get("/auth/me").cookie(new Cookie("auth_token", "jwt-valido")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("comprador"));
    }

    @Test
    void invalidJwtCannotAuthenticateButDoesNotBlockPublicCatalogReads() throws Exception {
        when(jwtService.extraerUsername("jwt-invalido"))
                .thenThrow(new io.jsonwebtoken.MalformedJwtException("invalid"));

        mockMvc.perform(get("/auth/me").cookie(new Cookie("auth_token", "jwt-invalido")))
                .andExpect(status().isUnauthorized());
        when(ropaService.listar(isNull(), any())).thenReturn(new PageImpl<>(List.of()));
        mockMvc.perform(get("/ropa").cookie(new Cookie("auth_token", "jwt-invalido")))
                .andExpect(status().isOk());
    }

    @Test
    void loginSetsJwtCookieAndInvalidCredentialsHaveAStableErrorCode() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(
                        "comprador", null, AuthorityUtils.createAuthorityList("ROLE_USER")));
        when(jwtService.generarToken("comprador", "ROLE_USER", 42L)).thenReturn("jwt-valido");
        when(usuarioRepository.findByCorreoElectronico("comprador@example.com"))
                .thenReturn(Optional.of(usuario()));

        CsrfSession csrf = csrfSession();
        mockMvc.perform(withCsrf(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"comprador@example.com\",\"password\":\"test-password\"}"),
                csrf))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("comprador"))
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.allOf(
                                org.hamcrest.Matchers.containsString("auth_token=jwt-valido"),
                                org.hamcrest.Matchers.containsString("HttpOnly"),
                                org.hamcrest.Matchers.containsString("SameSite=Lax"))));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("invalid"));
        csrf = csrfSession();
        mockMvc.perform(withCsrf(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"comprador\",\"password\":\"wrong\"}"),
                csrf))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void registrationIsPublicButStillRequiresCsrf() throws Exception {
        when(usuarioService.registrarUsuario(any(Usuario.class))).thenReturn(usuario());
        when(usuarioService.toDTO(any(Usuario.class))).thenReturn(new UsuarioDTO());

        mockMvc.perform(post("/api/usuarios/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"comprador\",\"email\":\"user@example.com\",\"password\":\"test-password\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("CSRF_INVALID"));

        CsrfSession csrf = csrfSession();
        mockMvc.perform(withCsrf(post("/api/usuarios/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"comprador\",\"email\":\"user@example.com\",\"password\":\"test-password\"}"),
                csrf))
                .andExpect(status().isOk());
    }

    @Test
    void catalogAndImageReadsDoNotRequireAuthentication() throws Exception {
        when(ropaService.listar(isNull(), any())).thenReturn(new PageImpl<>(List.of()));
        String imageName = "public-image-" + System.nanoTime() + ".png";
        Path imagePath = TEST_UPLOAD_DIRECTORY.resolve(imageName);
        Files.createDirectories(TEST_UPLOAD_DIRECTORY);
        Files.write(imagePath, new byte[] { 1, 2, 3 });

        try {
            mockMvc.perform(get("/ropa"))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/uploads/" + imageName))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/imagenes/" + imageName))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/uploads/missing-security-test.png"))
                    .andExpect(status().isNotFound());
        } finally {
            Files.deleteIfExists(imagePath);
            Files.deleteIfExists(TEST_UPLOAD_DIRECTORY);
        }
    }

    @Test
    void corsAllowsOnlyTheConfiguredFrontendOriginWithCredentials() throws Exception {
        mockMvc.perform(options("/auth/me")
                        .header("Origin", "https://tienda-eight-chi.vercel.app")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://tienda-eight-chi.vercel.app"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));

        mockMvc.perform(options("/auth/me")
                        .header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminRouteRejectsAnonymousAndNonAdminUsers() throws Exception {
        UserDetails userDetails = User.withUsername("comprador")
                .password("not-used")
                .authorities("ROLE_USER")
                .build();
        when(jwtService.extraerUsername("jwt-usuario")).thenReturn("comprador");
        when(jwtService.validarToken(eq("jwt-usuario"), any(UserDetails.class))).thenReturn(true);
        when(usuarioDetailsService.loadUserByUsername("comprador")).thenReturn(userDetails);

        mockMvc.perform(get("/ropa/admin"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/ropa/admin").cookie(new Cookie("auth_token", "jwt-usuario")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));

        UserDetails adminDetails = User.withUsername("admin")
                .password("not-used")
                .authorities("ROLE_ADMIN")
                .build();
        when(jwtService.extraerUsername("jwt-admin")).thenReturn("admin");
        when(jwtService.validarToken(eq("jwt-admin"), any(UserDetails.class))).thenReturn(true);
        when(usuarioDetailsService.loadUserByUsername("admin")).thenReturn(adminDetails);
        when(ropaService.listarTodos()).thenReturn(List.of());

        mockMvc.perform(get("/ropa/admin").cookie(new Cookie("auth_token", "jwt-admin")))
                .andExpect(status().isOk());
    }

    private CsrfSession csrfSession() throws Exception {
        MvcResult result = mockMvc.perform(get("/auth/csrf"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        Cookie cookie = result.getResponse().getCookie("XSRF-TOKEN");
        assertNotNull(cookie);
        return new CsrfSession(cookie, body.get("token").asText());
    }

    private MockHttpServletRequestBuilder withCsrf(
            MockHttpServletRequestBuilder request,
            CsrfSession csrf) {
        return request.cookie(csrf.cookie()).header("X-XSRF-TOKEN", csrf.token());
    }

    private Usuario usuario() {
        Usuario usuario = new Usuario();
        usuario.setId(42L);
        usuario.setUsername("comprador");
        usuario.setCorreoElectronico("comprador@example.com");
        usuario.setRol("ROLE_USER");
        usuario.setActivo(true);
        return usuario;
    }

    private record CsrfSession(Cookie cookie, String token) {
    }
}
