package com.example.dernek.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.dernek.entity.Duyuru;

public interface DuyuruRepository extends JpaRepository<Duyuru, Long> {
}