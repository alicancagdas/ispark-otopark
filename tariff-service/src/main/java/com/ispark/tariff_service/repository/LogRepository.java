package com.ispark.tariff_service.repository;

import com.ispark.tariff_service.model.LogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;


import com.ispark.tariff_service.model.LogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogRepository extends MongoRepository<LogEntry, String> {
}
