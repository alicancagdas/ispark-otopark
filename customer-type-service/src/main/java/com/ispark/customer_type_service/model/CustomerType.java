package com.ispark.customer_type_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "customer_types")
@EntityListeners(AuditingEntityListener.class)
public class CustomerType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String customerTypeNo;  // Unique identifier for the customer type

    @Column(nullable = false)
    private String name;  // e.g., Standard, Disabled, Police-Military

    @CreatedDate
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Yalnızca okunur hale getirir
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Yalnızca okunur hale getirir
    private LocalDateTime updatedAt;
}
