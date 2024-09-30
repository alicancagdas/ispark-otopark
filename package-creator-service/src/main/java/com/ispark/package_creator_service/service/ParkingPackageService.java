package com.ispark.package_creator_service.service;

import com.ispark.package_creator_service.model.ParkingPackage;
import com.ispark.package_creator_service.model.ParkingPackage.VehicleType;
import com.ispark.package_creator_service.repository.ParkingPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingPackageService {

    @Autowired
    private ParkingPackageRepository parkingPackageRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "package-request", groupId = "packagecreator-group")
    public void consumePackageRequest(String packageRequest) {
        String[] requestParts = packageRequest.split(",");
        String packageId = requestParts[0];
        String vehicleType = requestParts[1];

        // Simulated logic to find tariffId
        String tariffId = "" + packageId;
        kafkaTemplate.send("package-response", tariffId);
    }

    // Aktif tarifeyi getirme
    public Optional<String> getActiveTariff(String packageId, String vehicleTypeNo) {
        ParkingPackage parkingPackage = getParkingPackageById(packageId);

        // İlgili araç tipi için aktif tarifeyi bul
        Optional<VehicleType> vehicleTypeOpt = parkingPackage.getVehicleTypes().stream()
                .filter(vehicleType -> vehicleType.getVehicleTypeNo().equals(vehicleTypeNo))
                .findFirst();

        // Eğer araç tipi varsa, aktif tarifeyi döndür
        return vehicleTypeOpt.map(VehicleType::getActiveTariffNo);
    }
    // Aktif tarifeyi getirme (vehicleTypeName ile)
    public Optional<String> getActiveTariffByVehicleTypeName(String packageId, String vehicleTypeName) {
        ParkingPackage parkingPackage = getParkingPackageById(packageId);

        // İlgili araç tipi için aktif tarifeyi bul (vehicleTypeName ile)
        Optional<VehicleType> vehicleTypeOpt = parkingPackage.getVehicleTypes().stream()
                .filter(vehicleType -> vehicleType.getVehicleTypeName().equalsIgnoreCase(vehicleTypeName))
                .findFirst();

        // Eğer araç tipi varsa, aktif tarifeyi döndür
        return vehicleTypeOpt.map(VehicleType::getActiveTariffNo);
    }
    // Aktif tarifeyi güncelleme
    public ParkingPackage updateActiveTariff(String packageId, String vehicleTypeNo, String newTariffNo) {
        ParkingPackage parkingPackage = getParkingPackageById(packageId);

        // İlgili araç tipini bul ve aktif tarifeyi güncelle
        Optional<VehicleType> vehicleTypeOpt = parkingPackage.getVehicleTypes().stream()
                .filter(vehicleType -> vehicleType.getVehicleTypeNo().equals(vehicleTypeNo))
                .findFirst();

        if (vehicleTypeOpt.isPresent()) {
            VehicleType vehicleType = vehicleTypeOpt.get();

            // Tarifeler arasında yeni aktif tarifeyi bul
            boolean validTariff = vehicleType.getTariffs().stream()
                    .anyMatch(tariff -> tariff.getTariffNo().equals(newTariffNo));

            if (!validTariff) {
                throw new RuntimeException("Tarife bulunamadı");
            }

            // Aktif tarifeyi güncelle
            vehicleType.setActiveTariffNo(newTariffNo);
            return parkingPackageRepository.save(parkingPackage);
        } else {
            throw new RuntimeException("Araç tipi bulunamadı");
        }
    }

    // Park paketlerini diğer CRUD işlemleri ile birlikte tutan metotlar
    public ParkingPackage createParkingPackage(ParkingPackage parkingPackage) {
        return parkingPackageRepository.save(parkingPackage);
    }

    public List<ParkingPackage> getAllParkingPackages() {
        return parkingPackageRepository.findAll();
    }

    public ParkingPackage getParkingPackageById(String id) {
        return parkingPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paket bulunamadı"));
    }

    public ParkingPackage updateParkingPackage(String id, ParkingPackage parkingPackage) {
        ParkingPackage existingPackage = getParkingPackageById(id);
        existingPackage.setPackageName(parkingPackage.getPackageName());
        existingPackage.setPackageDescription(parkingPackage.getPackageDescription());
        existingPackage.setCustomerTypeName(parkingPackage.getCustomerTypeName());
        existingPackage.setCustomerTypeNo(parkingPackage.getCustomerTypeNo());
        existingPackage.setVehicleTypes(parkingPackage.getVehicleTypes());
        return parkingPackageRepository.save(existingPackage);
    }

    public void deleteParkingPackage(String id) {
        ParkingPackage parkingPackage = getParkingPackageById(id);
        parkingPackageRepository.delete(parkingPackage);
    }

    public ParkingPackage duplicateParkingPackage(String id) {
        ParkingPackage originalPackage = getParkingPackageById(id);
        ParkingPackage newPackage = new ParkingPackage();
        newPackage.setPackageName(originalPackage.getPackageName() + " - Copy");
        newPackage.setPackageDescription(originalPackage.getPackageDescription());
        newPackage.setCustomerTypeName(originalPackage.getCustomerTypeName());
        newPackage.setCustomerTypeNo(originalPackage.getCustomerTypeNo());
        newPackage.setVehicleTypes(originalPackage.getVehicleTypes());
        return parkingPackageRepository.save(newPackage);
    }
}
