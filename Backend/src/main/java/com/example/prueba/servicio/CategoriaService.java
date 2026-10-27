package com.example.prueba.servicio;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.prueba.dto.CategoriaDTO;
import com.example.prueba.entity.Categoria;
import com.example.prueba.exception.RecursoNoEncontradoException;
import com.example.prueba.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaDTO> listarActivas() {
        return categoriaRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO buscarPorId(Long id) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
        return toDTO(cat);
    }

    @Transactional
    public CategoriaDTO crear(CategoriaDTO dto) {
        if (categoriaRepository.findByNombreIgnoreCase(dto.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }
        Categoria cat = new Categoria();
        cat.setNombre(dto.getNombre());
        cat.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        Categoria guardada = categoriaRepository.save(cat);
        return toDTO(guardada);
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaDTO dto) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));

        // Verificar si el nombre cambió y si ya existe
        if (!cat.getNombre().equalsIgnoreCase(dto.getNombre())) {
            if (categoriaRepository.findByNombreIgnoreCase(dto.getNombre()).isPresent()) {
                throw new IllegalArgumentException("Ya existe otra categoría con ese nombre");
            }
        }

        cat.setNombre(dto.getNombre());
        if (dto.getActivo() != null) {
            cat.setActivo(dto.getActivo());
        }

        Categoria actualizada = categoriaRepository.save(cat);
        return toDTO(actualizada);
    }

    @Transactional
    public void desactivar(Long id) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
        cat.setActivo(false);
        categoriaRepository.save(cat);
    }

    @Transactional
    public void reactivar(Long id) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
        cat.setActivo(true);
        categoriaRepository.save(cat);
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
        categoriaRepository.delete(cat);
    }

    private CategoriaDTO toDTO(Categoria entity) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setActivo(entity.getActivo());
        return dto;
    }
}
