package com.ispark.customer_type_service.repository;

import com.ispark.customer_type_service.model.OperationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
}
