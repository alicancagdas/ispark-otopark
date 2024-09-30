package com.ispark.tariff_finder_service.controller;

import com.ispark.tariff_finder_service.service.TariffFinderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tariff-finder")
public class TariffFinderController {

    @Autowired
    private TariffFinderService tariffFinderService;

    @GetMapping
    public Object findActiveTariff(
            @RequestParam String parkingLotNo,
            @RequestParam String customerType,
            @RequestParam String vehicleTypeName) {
        return tariffFinderService.findTariff(parkingLotNo, customerType, vehicleTypeName);
    }
}
