package com.example.dernek.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.dernek.dto.HaberRequestDto;
import com.example.dernek.entity.Haber;
import com.example.dernek.service.HaberService;

@RestController
@RequestMapping("/api/haberler")
public class HaberController {

    private final HaberService haberService;

    public HaberController(HaberService haberService) {
        this.haberService = haberService;
    }

    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Haber haberEkle(@RequestBody HaberRequestDto dto) {
        return haberService.haberEkle(dto);
    }

    
    @GetMapping
    public List<Haber> tumHaberleriGetir() {
        return haberService.tumHaberleriGetir();
    }

    // SADECE ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Haber haberGuncelle(@PathVariable Long id, @RequestBody HaberRequestDto dto) {
        return haberService.haberGuncelle(id, dto);
    }

    // SADECE ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void haberSil(@PathVariable Long id) {
        haberService.haberSil(id);
    }
}