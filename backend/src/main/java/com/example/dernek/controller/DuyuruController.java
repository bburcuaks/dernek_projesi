package com.example.dernek.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.dernek.dto.DuyuruRequestDto;
import com.example.dernek.entity.Duyuru;
import com.example.dernek.service.DuyuruService;

@RestController
@RequestMapping("/api/duyurular")
public class DuyuruController {

    private final DuyuruService duyuruService;

    public DuyuruController(DuyuruService duyuruService) {
        this.duyuruService = duyuruService;
    }

    // SADECE ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Duyuru duyuruEkle(@RequestBody DuyuruRequestDto dto) {
        return duyuruService.duyuruEkle(dto);
    }

    // HERKES GÖREBİLİR
    @GetMapping
    public List<Duyuru> tumDuyurulariGetir() {
        return duyuruService.tumDuyurulariGetir();
    }

    // SADECE ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Duyuru duyuruGuncelle(@PathVariable Long id, @RequestBody DuyuruRequestDto dto) {
        return duyuruService.duyuruGuncelle(id, dto);
    }

    // SADECE ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void duyuruSil(@PathVariable Long id) {
        duyuruService.duyuruSil(id);
    }

    // SADECE ADMIN - RESİM YÜKLEME
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public String uploadResim(@RequestParam("file") MultipartFile file) {
        try {
            String dosyaAdi = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path dosyaYolu = uploadPath.resolve(dosyaAdi);
            Files.write(dosyaYolu, file.getBytes());

            return "/uploads/" + dosyaAdi;

        } catch (IOException e) {
            throw new RuntimeException("Dosya yüklenemedi: " + e.getMessage());
        }
    }
}