package com.smartewaste.backend.controller;

import com.smartewaste.backend.entity.CollectionRequest;
import com.smartewaste.backend.service.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.io.IOException;

@RestController
@RequestMapping("/api/collection")
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(
            @RequestParam("deviceType") String deviceType,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("condition") String condition,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("address") String address,
            @RequestParam("pickupDate") LocalDate pickupDate,
            @RequestParam("pickupTime") LocalTime pickupTime,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            CollectionRequest request = collectionService.createRequest(
                    username, deviceType, brand, model, condition, quantity, address, remarks, pickupDate, pickupTime,
                    image);
            return ResponseEntity.ok(request);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log error to console
            return ResponseEntity.internalServerError().body("Critical Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(collectionService.getMyRequests(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log error to console
            return ResponseEntity.internalServerError().body("Critical Error: " + e.getMessage());
        }
    }
}
