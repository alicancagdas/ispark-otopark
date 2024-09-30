package com.ispark.tariff_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "log_entries")
public class LogEntry {

    @Id
    private String id; // MongoDB tarafından otomatik oluşturulacak

    private String operation;
    private String details;

    // İki parametreli yapıcı (constructor)
    public LogEntry(String operation, String details) {
        this.operation = operation;
        this.details = details;
    }
}
