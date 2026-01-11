package com.smartewaste.backend.entity;

import com.smartewaste.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "collection_requests")
@Data
public class CollectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    private String deviceType;
    private String brand;
    private String model;
    @Column(name = "item_condition")
    private String condition; // Working, Damaged, Dead
    private Integer quantity;

    @Column(length = 1000)
    private String imagePath; // Path to stored image

    private String address;
    private String remarks;

    private LocalDate pickupDate;
    private LocalTime pickupTime;

    // ✅ NEW: Assigned Pickup Personnel
    private String pickupPersonnel;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
}
