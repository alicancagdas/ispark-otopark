package com.ispark.parkinglot_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "parking_lots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ParkingLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primary key

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Parking lot number is mandatory")
    private String parkingLotNo;  // Unique code for the parking lot (e.g., "PL1001")

    @Column(nullable = false)
    @NotBlank(message = "Name is mandatory")
    private String name;  // Name of the parking lot

    @Min(value = 0, message = "Capacity cannot be negative")
    private int capacity;  // Total number of parking spaces

    @Min(value = 0, message = "Available spaces cannot be negative")
    private int availableSpaces;  // Number of currently available spaces

    @Min(value = 0, message = "Number of employees cannot be negative")
    private int numberOfEmployees;  // Number of employees

    @Min(value = 0, message = "Number of entrances cannot be negative")
    private int numberOfEntrances;  // Total number of entrances

    @ElementCollection
    private List<String> entranceNumbers;  // List of entrance identifiers

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Parking lot type is mandatory")
    private ParkingLotType parkingLotType;  // Parking lot type selected from the enum

    // Location information
    private String cityCode;        // City code from LocationService
    private String districtCode;    // District code from LocationService
    private String streetCode;      // Street code from LocationService
    private String address;         // Detailed address

    // Upper Package IDs associated with the parking lot
    @ElementCollection
    private List<String> upperPackageIds;

    // Aktif olan Upper Package ID'si
    @Column(name = "active_upper_package_id", nullable = true)
    private String activeUpperPackageId;

    // Operating hours
    private String operatingHours;  // e.g., "24/7", "Mon-Fri 08:00-22:00"

    // Additional fields
    private boolean isActive;
    private String contactNumber;   // Contact number for the parking lot
    private String email;           // Contact email

    @Column(length = 1000)
    private String description;     // Description or notes about the parking lot

    @CreatedDate
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Yalnızca okunur hale getirir
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Yalnızca okunur hale getirir
    private LocalDateTime updatedAt;
}
