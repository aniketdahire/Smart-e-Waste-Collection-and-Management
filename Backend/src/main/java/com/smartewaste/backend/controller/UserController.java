package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.UpdateProfileRequest;
import com.smartewaste.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    // ================== GET PROFILE ==================
    // ================== GET PROFILE ==================
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(java.security.Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = principal.getName();
        return ResponseEntity.ok(userService.getUserSummary(email));
    }

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProfile(
            java.security.Principal principal,
            @RequestPart("data") UpdateProfileRequest request,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "addressProof", required = false) MultipartFile addressProof) throws Exception {

        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        userService.updateProfile(
                principal.getName(), // ✅ EMAIL from JWT
                request,
                idProof,
                addressProof);

        return ResponseEntity.ok("Profile updated successfully");
    }
}
