package com.ispark.api_gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("tariff-service", r -> r.path("/api/tariffs/**")
                        .uri("http://tariff-service:8080"))
                .route("package-creator-service", r -> r.path("/api/packages/**")
                        .uri("http://package-creator-service:8085"))
                .route("parkinglot-service", r -> r.path("/api/parking-lots/**")
                        .uri("http://parkinglot-service:8087"))
                .route("vehicle-type-service", r -> r.path("/api/vehicle-types/**")
                        .uri("http://vehicle-type-service:8083"))
                .route("customer-type-service", r -> r.path("/api/customer-types/**")
                        .uri("http://customer-type-service:8082"))
                .route("upper-package-service", r -> r.path("/api/upper-packages/**")
                        .uri("http://upper-package-service:8086"))
                .route("location-service", r -> r.path("/api/districts/**")
                        .uri("http://location-service:8084"))
                .build();
    }
}
