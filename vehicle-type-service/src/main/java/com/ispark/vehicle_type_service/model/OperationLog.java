package com.ispark.vehicle_type_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "operation_logs")
@EntityListeners(AuditingEntityListener.class)
public class OperationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String operation;

    @Column(nullable = false)
    private String details;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    // Manually defined constructor
    public OperationLog(String operation, String details) {
        this.operation = operation;
        this.details = details;
        this.timestamp = LocalDateTime.now(); // Automatically set the timestamp here
    }


}
