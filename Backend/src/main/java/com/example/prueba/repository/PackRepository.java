
package com.example.prueba.repository;

import com.example.prueba.entity.Pack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackRepository extends JpaRepository<Pack, Long> {

    List<Pack> findByActivoTrue();

}
