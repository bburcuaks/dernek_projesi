package com.example.dernek.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.dernek.dto.DuyuruRequestDto;
import com.example.dernek.entity.Duyuru;
import com.example.dernek.repository.DuyuruRepository;

@Service
public class DuyuruService {

    private final DuyuruRepository duyuruRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DuyuruService(DuyuruRepository duyuruRepository,
                         SimpMessagingTemplate messagingTemplate) {
        this.duyuruRepository = duyuruRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Duyuru duyuruEkle(DuyuruRequestDto dto) {
        Duyuru duyuru = new Duyuru();
        duyuru.setKonu(dto.getKonu());
        duyuru.setIcerik(dto.getIcerik());
        duyuru.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        duyuru.setResimYolu(dto.getResimYolu());

        Duyuru kaydedilenDuyuru = duyuruRepository.save(duyuru);
        messagingTemplate.convertAndSend("/topic/duyurular", kaydedilenDuyuru);

        return kaydedilenDuyuru;
    }

    public List<Duyuru> tumDuyurulariGetir() {
        return duyuruRepository.findAll();
    }

    public Duyuru duyuruGuncelle(Long id, DuyuruRequestDto dto) {
        Duyuru duyuru = duyuruRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Duyuru bulunamadı"));

        duyuru.setKonu(dto.getKonu());
        duyuru.setIcerik(dto.getIcerik());
        duyuru.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        duyuru.setResimYolu(dto.getResimYolu());

        Duyuru guncellenenDuyuru = duyuruRepository.save(duyuru);
        messagingTemplate.convertAndSend("/topic/duyurular-guncelle", guncellenenDuyuru);

        return guncellenenDuyuru;
    }

    public void duyuruSil(Long id) {
        Duyuru duyuru = duyuruRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Duyuru bulunamadı"));

        duyuruRepository.delete(duyuru);
        messagingTemplate.convertAndSend("/topic/duyurular-sil", id);
    }
}