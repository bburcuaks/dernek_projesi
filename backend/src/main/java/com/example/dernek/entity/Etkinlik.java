package com.example.dernek.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import java.time.LocalDate;


@Entity
@Table(name = "etkinlik")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "etkinlik_tipi")

public  abstract class Etkinlik {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(nullable = false)
	    private String konu;

	    @Column(nullable = false, columnDefinition = "TEXT")
	    private String icerik;

	    @Column(nullable = false)
	    private LocalDate gecerlilikTarihi;

	    public Long getId() {
	        return id;
	    }

	    public String getKonu() {
	        return konu;
	    }

	    public void setKonu(String konu) {
	        this.konu = konu;
	    }

	    public String getIcerik() {
	        return icerik;
	    }

	    public void setIcerik(String icerik) {
	        this.icerik = icerik;
	    }

	    public LocalDate getGecerlilikTarihi() {
	        return gecerlilikTarihi;
	    }

	    public void setGecerlilikTarihi(LocalDate gecerlilikTarihi) {
	        this.gecerlilikTarihi = gecerlilikTarihi;
	    }
}
