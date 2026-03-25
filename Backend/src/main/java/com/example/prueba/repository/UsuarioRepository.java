package com.example.prueba.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.prueba.entity.*;

//Esta clase hace referencia a la tabla de usuario
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

     Optional<Usuario> findByUsername(String username);

}
