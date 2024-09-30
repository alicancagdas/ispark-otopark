package com.ispark.upper_package_service.controller;

import com.ispark.upper_package_service.model.UpperPackage;
import com.ispark.upper_package_service.service.UpperPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")  // Allow all origins during development
@RestController
@RequestMapping("/api/upper-packages")
public class UpperPackageController {

    @Autowired
    private UpperPackageService service;

    private static final Logger logger = LoggerFactory.getLogger(UpperPackageController.class);

    // Create new upper package
    @PostMapping
    public ResponseEntity<UpperPackage> createUpperPackage(@RequestBody UpperPackage upperPackage) {
        logger.info("Creating new upper package: {}", upperPackage.getUpperPackageName());
        UpperPackage created = service.createUpperPackage(upperPackage);
        return ResponseEntity.ok(created);
    }

    // Get all upper packages
    @GetMapping
    public ResponseEntity<List<UpperPackage>> getAllUpperPackages() {
        logger.info("Retrieving all upper packages");
        return ResponseEntity.ok(service.findAll());
    }

    // Get upper package by upperPackageNo
    @GetMapping("/no/{upperPackageNo}")
    public ResponseEntity<UpperPackage> getUpperPackageByNo(@PathVariable String upperPackageNo) {
        logger.info("Retrieving upper package by no: {}", upperPackageNo);
        UpperPackage found = service.findByUpperPackageNo(upperPackageNo);
        return ResponseEntity.ok(found);
    }

    // Get upper package by upperPackageId (String type)
    @GetMapping("/id/{upperPackageId}")
    public ResponseEntity<UpperPackage> getUpperPackageById(@PathVariable String upperPackageId) {
        logger.info("Retrieving upper package by id: {}", upperPackageId);
        UpperPackage found = service.findByUpperPackageId(upperPackageId);
        return ResponseEntity.ok(found);
    }

    // Update upper package by upperPackageNo
    @PutMapping("/no/{upperPackageNo}")
    public ResponseEntity<UpperPackage> updateUpperPackageByNo(@PathVariable String upperPackageNo, @RequestBody UpperPackage upperPackage) {
        logger.info("Updating upper package no: {}", upperPackageNo);
        UpperPackage updated = service.updateByUpperPackageNo(upperPackageNo, upperPackage);
        return ResponseEntity.ok(updated);
    }

    // Update upper package by upperPackageId (String type)
    @PutMapping("/id/{upperPackageId}")
    public ResponseEntity<UpperPackage> updateUpperPackageById(@PathVariable String upperPackageId, @RequestBody UpperPackage upperPackage) {
        logger.info("Updating upper package id: {}", upperPackageId);
        UpperPackage updated = service.updateByUpperPackageId(upperPackageId, upperPackage);
        return ResponseEntity.ok(updated);
    }

    // Delete upper package by upperPackageNo
    @DeleteMapping("/no/{upperPackageNo}")
    public ResponseEntity<Void> deleteUpperPackageByNo(@PathVariable String upperPackageNo) {
        logger.info("Deleting upper package no: {}", upperPackageNo);
        service.deleteByUpperPackageNo(upperPackageNo);
        return ResponseEntity.ok().build();
    }

    // Delete upper package by upperPackageId (String type)
    @DeleteMapping("/id/{upperPackageId}")
    public ResponseEntity<Void> deleteUpperPackageById(@PathVariable String upperPackageId) {
        logger.info("Deleting upper package id: {}", upperPackageId);
        service.deleteByUpperPackageId(upperPackageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-upperpackage-and-customer-type")
    public ResponseEntity<String> getSubPackageIdByCustomerType(
            @RequestParam String upperPackageId,
            @RequestParam String subCustomerType) {

        // UpperPackageId'ye göre UpperPackage'ı al
        UpperPackage upperPackage = service.findByUpperPackageId(upperPackageId);

        // UpperPackage içindeki SubPackage'leri CustomerType ile eşleştir ve SubPackageId'yi bul
        Optional<String> matchedSubPackageId = upperPackage.getUpperSubPackages().stream()
                .filter(subPackage -> subPackage.getSubCustomerType().equalsIgnoreCase(subCustomerType))
                .map(UpperPackage.SubPackageInfo::getSubPackageId) // Sadece subPackageId'yi al
                .findFirst(); // İlk eşleşmeyi bul

        // Eğer eşleşen SubPackageId varsa 200 OK ile döndür, yoksa 404 Not Found döndür
        return matchedSubPackageId.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }



}
