package com.ispark.vehicle_type_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing

public class VehicleTypeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VehicleTypeServiceApplication.class, args);
	}

}
