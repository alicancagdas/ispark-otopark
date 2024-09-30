package com.ispark.upper_package_service.service;

import com.ispark.upper_package_service.kafka.UpperPackageProducer;
import com.ispark.upper_package_service.model.UpperPackage;
import com.ispark.upper_package_service.repository.UpperPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UpperPackageService {

    @Autowired
    private UpperPackageRepository repository;

    @Autowired
    private UpperPackageProducer producer;


    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "upper-package-request", groupId = "upperpackage-group")
    public void consumeUpperPackageRequest(String upperPackageRequest) {
        String[] requestParts = upperPackageRequest.split(",");
        String upperPackageId = requestParts[0];
        String customerType = requestParts[1];

        // Simulated logic to find packageId
        String packageId =""+upperPackageId;
        kafkaTemplate.send("upper-package-response", packageId);
    }

    // Create a new upper package
    public UpperPackage createUpperPackage(UpperPackage upperPackage) {
        return repository.save(upperPackage);
    }

    // Find all upper packages
    public List<UpperPackage> findAll() {
        return repository.findAll();
    }

    // Find upper package by upperPackageId (String type)
    public UpperPackage findByUpperPackageId(String upperPackageId) {
        return repository.findById(upperPackageId)
                .orElseThrow(() -> new RuntimeException("Upper package not found with id: " + upperPackageId));
    }

    // Find upper package by upperPackageNo
    public UpperPackage findByUpperPackageNo(String upperPackageNo) {
        return repository.findByUpperPackageNo(upperPackageNo)
                .orElseThrow(() -> new RuntimeException("Upper package not found with packageNo: " + upperPackageNo));
    }

    // Update upper package by upperPackageId (String type)
    public UpperPackage updateByUpperPackageId(String upperPackageId, UpperPackage updatedUpperPackage) {
        UpperPackage packageToUpdate = findByUpperPackageId(upperPackageId);
        packageToUpdate.setUpperPackageName(updatedUpperPackage.getUpperPackageName());
        packageToUpdate.setUpperPackageDescription(updatedUpperPackage.getUpperPackageDescription());
        packageToUpdate.setUpperSubPackages(updatedUpperPackage.getUpperSubPackages());
        return repository.save(packageToUpdate);
    }

    // Update upper package by upperPackageNo
    public UpperPackage updateByUpperPackageNo(String upperPackageNo, UpperPackage updatedUpperPackage) {
        UpperPackage packageToUpdate = findByUpperPackageNo(upperPackageNo);
        packageToUpdate.setUpperPackageName(updatedUpperPackage.getUpperPackageName());
        packageToUpdate.setUpperPackageDescription(updatedUpperPackage.getUpperPackageDescription());
        packageToUpdate.setUpperSubPackages(updatedUpperPackage.getUpperSubPackages());
        return repository.save(packageToUpdate);
    }

    // Delete upper package by upperPackageId (String type)
    public void deleteByUpperPackageId(String upperPackageId) {
        UpperPackage packageToDelete = findByUpperPackageId(upperPackageId);
        repository.delete(packageToDelete);
    }

    // Delete upper package by upperPackageNo
    public void deleteByUpperPackageNo(String upperPackageNo) {
        UpperPackage packageToDelete = findByUpperPackageNo(upperPackageNo);
        repository.delete(packageToDelete);
    }

    public List<UpperPackage.SubPackageInfo> getSubPackagesByCustomerType(String upperPackageId, String subCustomerType) {
        // Belirtilen UpperPackageId'ye göre UpperPackage'i bul
        UpperPackage upperPackage = findByUpperPackageId(upperPackageId);

        // SubPackage'leri CustomerType'a göre filtrele
        return upperPackage.getUpperSubPackages().stream()
                .filter(subPackage -> subPackage.getSubCustomerType().equalsIgnoreCase(subCustomerType))
                .collect(Collectors.toList());
    }


}
