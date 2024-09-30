package com.ispark.package_creator_service.service;

import com.ispark.package_creator_service.model.ParkingPackage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    @KafkaListener(topics = "parking-package-request", groupId = "package_group")
    public void listenPackageRequest(ParkingPackage parkingPackage) {
        System.out.println("Received Parking Package Request: " + parkingPackage);
        // İşlem yapılacak yer
    }

    @KafkaListener(topics = "vehicle-type-response", groupId = "package_group")
    public void listenVehicleTypeResponse(String vehicleTypeResponse) {
        System.out.println("Received Vehicle Type Response: " + vehicleTypeResponse);
        // İşlem yapılacak yer
    }
}
