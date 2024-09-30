package com.ispark.tariff_finder_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
public class TariffFinderService {

    private final WebClient webClient;

    @Autowired
    public TariffFinderService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Object findTariff(String parkingLotNo, String customerType, String vehicleTypeName) {
        try {
            // Step 1: Get Active Upper Package ID
            String upperPackageId = getActiveUpperPackage(parkingLotNo).block();

            // Step 2: Get SubPackage ID
            String subPackageId = getSubPackageId(upperPackageId, customerType).block();

            // Step 3: Get Active Tariff (tarifeNo)
            String tarifeNo = getActiveTariff(subPackageId, vehicleTypeName).block();

            // Step 4: Get Tariff Details
            return getTariffDetails(tarifeNo).block();

        } catch (WebClientResponseException e) {
            System.err.println("Status code: " + e.getStatusCode());
            System.err.println("Response body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
            throw e;
        }
    }

    private Mono<String> getActiveUpperPackage(String parkingLotNo) {
        return webClient.get()
                .uri("http://parkinglot-service:8087/api/parking-lots/{parkingLotNo}/active-package", parkingLotNo)
                .retrieve()
                .onStatus(status -> status.isError(), response -> Mono.error(new RuntimeException("Error fetching active upper package")))
                .bodyToMono(String.class);
    }

    private Mono<String> getSubPackageId(String upperPackageId, String customerType) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("http")
                        .host("upper-package-service")
                        .port(8086)
                        .path("/api/upper-packages/by-upperpackage-and-customer-type")
                        .queryParam("upperPackageId", upperPackageId)
                        .queryParam("subCustomerType", customerType)
                        .build())
                .retrieve()
                .onStatus(status -> status.isError(), response -> Mono.error(new RuntimeException("Error fetching sub package ID")))
                .bodyToMono(String.class);
    }

    private Mono<String> getActiveTariff(String subPackageId, String vehicleTypeName) {
        return webClient.get()
                .uri("http://package-creator-service:8085/api/parking-packages/packages/{subPackageId}/vehicle-types/{vehicleTypeName}/active-tariff", subPackageId, vehicleTypeName)
                .retrieve()
                .onStatus(status -> status.isError(), response -> Mono.error(new RuntimeException("Error fetching active tariff")))
                .bodyToMono(String.class);
    }

    private Mono<Object> getTariffDetails(String tarifeNo) {
        return webClient.get()
                .uri("http://tariff-service:8080/api/tariffs/tarifeNo/{tarifeNo}", tarifeNo)
                .retrieve()
                .onStatus(status -> status.isError(), response -> Mono.error(new RuntimeException("Error fetching tariff details")))
                .bodyToMono(Object.class);
    }
}
