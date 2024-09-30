package com.ispark.parkinglot_service.repository;


import com.ispark.parkinglot_service.model.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
    Optional<ParkingLot> findByParkingLotNo(String parkingLotNo);
    void deleteByParkingLotNo(String parkingLotNo);
}
