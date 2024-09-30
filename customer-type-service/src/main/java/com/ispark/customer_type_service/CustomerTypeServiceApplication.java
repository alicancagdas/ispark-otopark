package com.ispark.customer_type_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class CustomerTypeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerTypeServiceApplication.class, args);
	}

}
