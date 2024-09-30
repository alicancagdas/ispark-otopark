package com.ispark.tariff_service.service;

import com.ispark.tariff_service.model.LogEntry;
import com.ispark.tariff_service.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoggingService {

    @Autowired
    private LogRepository logRepository;

    public void logOperation(String operation, String details) {
        LogEntry logEntry = new LogEntry(operation, details); // İki parametreli yapıcı kullanılıyor
        logRepository.save(logEntry); // LogEntry nesnesi kaydediliyor
    }
}
