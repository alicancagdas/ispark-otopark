package com.ispark.parkinglot_service.repository;

import com.ispark.parkinglot_service.model.OperationLog;
import com.ispark.parkinglot_service.model.OperationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
}
