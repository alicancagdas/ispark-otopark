package com.ispark.package_creator_service.controller;

import com.ispark.package_creator_service.model.ParkingPackage;
import com.ispark.package_creator_service.service.ParkingPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/parking-packages")
public class ParkingPackageController {

    @Autowired
    private ParkingPackageService parkingPackageService;

    @PostMapping
    public ResponseEntity<ParkingPackage> createParkingPackage(@RequestBody ParkingPackage parkingPackage) {
        return ResponseEntity.ok(parkingPackageService.createParkingPackage(parkingPackage));
    }


    @GetMapping
    public ResponseEntity<List<ParkingPackage>> getAllParkingPackages() {
        return ResponseEntity.ok(parkingPackageService.getAllParkingPackages());
    }

    @GetMapping("/packages/{packageId}/vehicle-types/{vehicleTypeName}/active-tariff")
    public ResponseEntity<String> getActiveTariffByVehicleTypeName(@PathVariable String packageId, @PathVariable String vehicleTypeName) {
        try {
            Optional<String> activeTariff = parkingPackageService.getActiveTariffByVehicleTypeName(packageId, vehicleTypeName);
            return activeTariff
                    .map(tariff -> ResponseEntity.ok().body(tariff))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving active tariff: " + e.getMessage());
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<ParkingPackage> getParkingPackageById(@PathVariable String id) {
        return ResponseEntity.ok(parkingPackageService.getParkingPackageById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingPackage> updateParkingPackage(
            @PathVariable String id, @RequestBody ParkingPackage parkingPackage) {
        return ResponseEntity.ok(parkingPackageService.updateParkingPackage(id, parkingPackage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParkingPackage(@PathVariable String id) {
        parkingPackageService.deleteParkingPackage(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/duplicate/{id}")
    public ResponseEntity<ParkingPackage> duplicateParkingPackage(@PathVariable String id) {
        return ResponseEntity.ok(parkingPackageService.duplicateParkingPackage(id));
    }
}
