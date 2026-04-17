package com.example.dernek;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.dernek.entity.Admin;
import com.example.dernek.repository.AdminRepository;

@SpringBootApplication
public class DernekApplication {

	public static void main(String[] args) {
		SpringApplication.run(DernekApplication.class, args);
	}

	@Bean
	CommandLineRunner init(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (adminRepository.findByUsername("admin").isEmpty()) {
				Admin admin = new Admin();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("1234"));
				admin.setRole("ADMIN");

				adminRepository.save(admin);
			}
		};
	}
}