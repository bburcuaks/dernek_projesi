package com.example.dernek.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.dernek.entity.Etkinlik;

public interface EtkinlikRepository extends JpaRepository<Etkinlik, Long> {
}