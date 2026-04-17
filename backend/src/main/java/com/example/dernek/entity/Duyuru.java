package com.example.dernek.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DUYURU")
public class Duyuru extends Etkinlik {

    @Column(name = "resim_yolu")
    private String resimYolu;

    public String getResimYolu() {
        return resimYolu;
    }

    public void setResimYolu(String resimYolu) {
        this.resimYolu = resimYolu;
    }
}