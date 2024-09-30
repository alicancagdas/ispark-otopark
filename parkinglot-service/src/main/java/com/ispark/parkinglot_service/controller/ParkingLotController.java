package com.ispark.parkinglot_service.controller;

import com.ispark.parkinglot_service.model.ParkingLot;
import com.ispark.parkinglot_service.service.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "*")  // Adjust as needed for security
@RestController
@RequestMapping("/api/parking-lots")
public class ParkingLotController {

    @Autowired
    private ParkingLotService service;

    @PostMapping
    public ResponseEntity<ParkingLot> createParkingLot(@Valid @RequestBody ParkingLot parkingLot) {
        ParkingLot createdParkingLot = service.createParkingLot(parkingLot);
        return ResponseEntity.ok(createdParkingLot);
    }

    // Tüm park alanlarını getir
    @GetMapping
    public ResponseEntity<List<ParkingLot>> getAllParkingLots() {
        List<ParkingLot> parkingLots = service.getAllParkingLots();
        return ResponseEntity.ok(parkingLots);
    }


    // Park alanını parkingLotNo ile getir
    @GetMapping("/{parkingLotNo}")
    public ResponseEntity<ParkingLot> getParkingLotByNo(@PathVariable String parkingLotNo) {
        ParkingLot parkingLot = service.getParkingLotByNo(parkingLotNo);
        return ResponseEntity.ok(parkingLot);
    }

    // Park alanını parkingLotNo ile güncelle
    @PutMapping("/{parkingLotNo}")
    public ResponseEntity<ParkingLot> updateParkingLot(@PathVariable String parkingLotNo, @Valid @RequestBody ParkingLot updatedParkingLot) {
        ParkingLot parkingLot = service.updateParkingLot(parkingLotNo, updatedParkingLot);
        return ResponseEntity.ok(parkingLot);
    }

    // Park alanını parkingLotNo ile sil
    @DeleteMapping("/{parkingLotNo}")
    public ResponseEntity<Void> deleteParkingLot(@PathVariable String parkingLotNo) {
        service.deleteParkingLot(parkingLotNo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{parkingLotNo}/active-package")
    public ResponseEntity<String> getActiveUpperPackage(@PathVariable String parkingLotNo) {
        try {
            String activeUpperPackageId = service.getActivePackageId(parkingLotNo);
            return ResponseEntity.ok(activeUpperPackageId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving active upper package ID: " + e.getMessage());
        }
    }

}
