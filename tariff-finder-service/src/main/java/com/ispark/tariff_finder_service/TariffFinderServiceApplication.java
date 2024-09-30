package com.ispark.tariff_finder_service;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TariffFinderServiceApplication {
	public static void main(String[] args) {
		new SpringApplicationBuilder(TariffFinderServiceApplication.class)
				.web(WebApplicationType.SERVLET)  // WebApplicationType.REACTIVE de olabilir, eğer reaktif bir uygulama kullanıyorsanız
				.run(args);
	}
}
