package com.ispark.parkinglot_service.service;

import com.ispark.parkinglot_service.model.ParkingLot;
import com.ispark.parkinglot_service.repository.ParkingLotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ParkingLotService {

    @Autowired
    private ParkingLotRepository repository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    // Kafka'dan park alanı isteği dinleyicisi
    @KafkaListener(topics = "parking-lot-request", groupId = "parkinglot-group")
    public void consumeParkingLotRequest(String parkingLotId) {
        // UpperPackageId'yi simüle et
        String upperPackageId = "UPP-" + parkingLotId;
        kafkaTemplate.send("parking-lot-response", upperPackageId);
    }

    // Park alanı üzerinden aktif paketi almak için method
    public String getActivePackageId(String parkingLotNo) {
        ParkingLot parkingLot = getParkingLotByNo(parkingLotNo);
        return parkingLot.getActiveUpperPackageId();
    }

    // Yeni bir park alanı oluştur
    public ParkingLot createParkingLot(ParkingLot parkingLot) {
        // Eğer upperPackageIds var ve boş değilse
        if (parkingLot.getUpperPackageIds() != null && !parkingLot.getUpperPackageIds().isEmpty()) {
            // Eğer aktif package set edilmemişse, ilkini aktif olarak işaretleyelim
            if (parkingLot.getActiveUpperPackageId() == null) {
                parkingLot.setActiveUpperPackageId(parkingLot.getUpperPackageIds().get(0));  // İlk UpperPackage'i aktif olarak işaretle
            }
        }
        return repository.save(parkingLot);
    }

    // Tüm park alanlarını getir
    public List<ParkingLot> getAllParkingLots() {
        return repository.findAll();
    }

    // Park alanını parkingLotNo ile getir
    public ParkingLot getParkingLotByNo(String parkingLotNo) {
        return repository.findByParkingLotNo(parkingLotNo)
                .orElseThrow(() -> new NoSuchElementException("Parking lot not found with number: " + parkingLotNo));
    }

    // Park alanını güncelle
    public ParkingLot updateParkingLot(String parkingLotNo, ParkingLot updatedParkingLot) {
        ParkingLot existingParkingLot = getParkingLotByNo(parkingLotNo);

        // Alanları güncelle
        existingParkingLot.setName(updatedParkingLot.getName());
        existingParkingLot.setCapacity(updatedParkingLot.getCapacity());
        existingParkingLot.setAvailableSpaces(updatedParkingLot.getAvailableSpaces());
        existingParkingLot.setNumberOfEmployees(updatedParkingLot.getNumberOfEmployees());
        existingParkingLot.setNumberOfEntrances(updatedParkingLot.getNumberOfEntrances());
        existingParkingLot.setEntranceNumbers(updatedParkingLot.getEntranceNumbers());
        existingParkingLot.setParkingLotType(updatedParkingLot.getParkingLotType());
        existingParkingLot.setCityCode(updatedParkingLot.getCityCode());
        existingParkingLot.setDistrictCode(updatedParkingLot.getDistrictCode());
        existingParkingLot.setStreetCode(updatedParkingLot.getStreetCode());
        existingParkingLot.setAddress(updatedParkingLot.getAddress());
        existingParkingLot.setUpperPackageIds(updatedParkingLot.getUpperPackageIds());
        existingParkingLot.setOperatingHours(updatedParkingLot.getOperatingHours());
        existingParkingLot.setContactNumber(updatedParkingLot.getContactNumber());
        existingParkingLot.setEmail(updatedParkingLot.getEmail());
        existingParkingLot.setDescription(updatedParkingLot.getDescription());

        // Eğer aktif package güncellenmişse ve geçerli bir upperPackageId ise
        if (updatedParkingLot.getActiveUpperPackageId() != null &&
                updatedParkingLot.getUpperPackageIds().contains(updatedParkingLot.getActiveUpperPackageId())) {
            existingParkingLot.setActiveUpperPackageId(updatedParkingLot.getActiveUpperPackageId());
        } else {
            // Eğer aktif bir paket yoksa ya da geçersizse ilkini aktif olarak ayarla
            existingParkingLot.setActiveUpperPackageId(existingParkingLot.getUpperPackageIds().get(0));
        }

        return repository.save(existingParkingLot);
    }

    // Park alanını parkingLotNo ile sil
    public void deleteParkingLot(String parkingLotNo) {
        ParkingLot parkingLot = getParkingLotByNo(parkingLotNo);
        repository.delete(parkingLot);
    }
}
