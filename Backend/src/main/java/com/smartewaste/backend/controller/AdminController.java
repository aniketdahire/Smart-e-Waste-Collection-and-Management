package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.AdminProfileDto;
import com.smartewaste.backend.dto.ApproveUserRequest;
import com.smartewaste.backend.dto.UserSummaryDto;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserService userService,
            PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // ============================
    // USERS
    // ============================

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users/approve")
    public ResponseEntity<String> approveUser(
            @Valid @RequestBody ApproveUserRequest request) {
        String rawTempPassword = userService.generateTempPassword();
        String encodedTempPassword = passwordEncoder.encode(rawTempPassword);

        UserAccount user = userService.approveUser(
                request.getUserId(),
                request.isApprove(),
                encodedTempPassword);

        if (request.isApprove()) {
            userService.sendCredentials(user, rawTempPassword);
            return ResponseEntity.ok("User approved. Temporary password emailed.");
        }

        return ResponseEntity.ok("User rejected.");
    }

    // ✅ NEW: Update User Status (Suspend/Verify)
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam com.smartewaste.backend.enums.UserStatus status) {
        try {
            userService.updateUserStatus(userId, status);
            return ResponseEntity.ok("User status updated to " + status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ✅ NEW: Delete User
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ============================
    // ADMIN PROFILE
    // ============================
    // ============================
    // ADMIN PROFILE
    // ============================

    // GET ADMIN PROFILE
    @GetMapping("/profile")
    public ResponseEntity<AdminProfileDto> getAdminProfile() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // comes from JWT subject

        UserAccount admin = userService.getProfileByUsername(username);

        AdminProfileDto dto = new AdminProfileDto();
        dto.setId(admin.getId());
        dto.setFullName(admin.getFullName());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setPhone(admin.getPhone());
        dto.setAddress(admin.getAddress());
        dto.setCity(admin.getCity());

        return ResponseEntity.ok(dto);
    }

    // UPDATE ADMIN PROFILE
    @PutMapping("/profile")
    public ResponseEntity<AdminProfileDto> updateAdminProfile(
            @RequestBody AdminProfileDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        UserAccount admin = userService.getProfileByUsername(username);

        admin.setFullName(dto.getFullName());
        admin.setPhone(dto.getPhone());
        admin.setAddress(dto.getAddress());
        admin.setCity(dto.getCity());

        userService.save(admin);

        dto.setEmail(admin.getEmail());
        dto.setUsername(admin.getUsername());
        dto.setId(admin.getId());

        return ResponseEntity.ok(dto);
    }

}
