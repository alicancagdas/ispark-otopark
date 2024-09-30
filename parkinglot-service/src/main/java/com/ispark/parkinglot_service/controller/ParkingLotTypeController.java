package com.ispark.parkinglot_service.controller;

import com.ispark.parkinglot_service.model.ParkingLotType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/parking-lot-types")
public class ParkingLotTypeController {

    @GetMapping
    public List<ParkingLotType> getAllParkingLotTypes() {
        return Arrays.asList(ParkingLotType.values());  // Tüm enum değerlerini döner
    }
}
