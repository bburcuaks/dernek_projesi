package com.example.dernek.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.dernek.entity.Haber;

public interface HaberRepository extends JpaRepository<Haber, Long> {
}