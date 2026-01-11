package com.smartewaste.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "personnel")
@Data
public class Personnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role; // e.g., "Driver", "Collector"

    private String phone;

    private boolean active = true; // Soft delete or just active status

    @Column(unique = true)
    private String email;

    private String address;
    private String pincode;
    private String password;
}
