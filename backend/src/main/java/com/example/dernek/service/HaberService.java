package com.example.dernek.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.dernek.dto.HaberRequestDto;
import com.example.dernek.entity.Haber;
import com.example.dernek.repository.HaberRepository;

@Service
public class HaberService {

    private final HaberRepository haberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public HaberService(HaberRepository haberRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.haberRepository = haberRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Haber haberEkle(HaberRequestDto dto) {
    	System.out.println("🔥 HABER EKLE METODU ÇALIŞTI!");
        Haber haber = new Haber();
        haber.setKonu(dto.getKonu());
        haber.setIcerik(dto.getIcerik());
        haber.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        haber.setHaberLinki(dto.getHaberLinki());

        Haber kaydedilen = haberRepository.save(haber);

        
        messagingTemplate.convertAndSend("/topic/haberler", kaydedilen);

        return kaydedilen;
    }

    public List<Haber> tumHaberleriGetir() {
        return haberRepository.findAll();
    }

    public Haber haberGuncelle(Long id, HaberRequestDto dto) {
        Haber haber = haberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı"));

        haber.setKonu(dto.getKonu());
        haber.setIcerik(dto.getIcerik());
        haber.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        haber.setHaberLinki(dto.getHaberLinki());

        Haber guncellenen = haberRepository.save(haber);

        messagingTemplate.convertAndSend("/topic/haberler-guncelle", guncellenen);

        return guncellenen;
    }

    public void haberSil(Long id) {
        haberRepository.deleteById(id);

        messagingTemplate.convertAndSend("/topic/haberler-sil", id);
    }
}