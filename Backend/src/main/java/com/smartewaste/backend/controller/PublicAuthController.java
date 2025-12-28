package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.LoginRequest;
import com.smartewaste.backend.dto.LoginResponse;
import com.smartewaste.backend.dto.RegisterUserRequest;
import com.smartewaste.backend.dto.ResetPasswordRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.service.AuthService;
import com.smartewaste.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicAuthController {

        private final UserService userService;
        private final AuthService authService;
        private final com.smartewaste.backend.service.OtpService otpService;

        public PublicAuthController(UserService userService, AuthService authService,
                        com.smartewaste.backend.service.OtpService otpService) {
                this.userService = userService;
                this.authService = authService;
                this.otpService = otpService;
        }

        // ✅ USER REGISTRATION — JSON ONLY (fullName, email, phone)
        @PostMapping(value = "/users/register", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> register(
                        @Valid @RequestBody RegisterUserRequest request) {
                UserAccount user = userService.registerUser(request);

                // Use OtpService to send OTP immediately after registration
                otpService.generateAndSendOtp(user.getEmail());

                return ResponseEntity.ok(
                                "Registration submitted. Please verify your email.");
        }

        // ✅ LOGIN
        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                        @Valid @RequestBody LoginRequest request) {
                return ResponseEntity.ok(authService.login(request));
        }

        // ✅ RESET PASSWORD (TEMP PASSWORD FLOW)
        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(
                        @Valid @RequestBody ResetPasswordRequest request) {
                System.out.println("🔍 RESET PASSWORD REQUEST RECEIVED: " + request.getUsername());
                try {
                        authService.resetPassword(request);
                        return ResponseEntity.ok("Password updated.");
                } catch (Exception e) {
                        System.err.println("❌ RESET PASSWORD FAILED: " + e.getMessage());
                        return ResponseEntity
                                        .status(401)
                                        .body(Map.of("message", "Reset Failed: " + e.getMessage()));
                }
        }

        // ✅ SEND OTP (Email Verification)
        @PostMapping("/send-otp")
        public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
                String email = body.get("email");
                if (email == null || email.isEmpty()) {
                        return ResponseEntity.badRequest().body("Email is required");
                }
                otpService.generateAndSendOtp(email);
                return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email));
        }

        // ✅ VERIFY OTP & ACTIVATE USER
        @PostMapping("/verify-otp")
        public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
                String email = body.get("email");
                String otp = body.get("otp");

                try {
                        userService.verifyUser(email, otp);
                        return ResponseEntity
                                        .ok(Map.of("message", "Email Verified & Account Activated", "success", true));
                } catch (RuntimeException e) {
                        return ResponseEntity.status(400)
                                        .body(Map.of("message", e.getMessage(), "success", false));
                }
        }

        // ✅ FORGOT PASSWORD (EMAIL LINK)
        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(
                        @RequestBody Map<String, String> body) {
                authService.forgotPassword(
                                body.get("email"),
                                "http://localhost:3000");
                return ResponseEntity.ok("Password reset link sent.");
        }

        // ✅ RESET PASSWORD USING EMAIL LINK
        @PostMapping("/reset-password-link")
        public ResponseEntity<?> resetPasswordWithLink(
                        @RequestBody Map<String, String> body) {
                authService.resetPasswordWithToken(
                                body.get("email"),
                                body.get("token"),
                                body.get("newPassword"));
                return ResponseEntity.ok("Password reset successful.");
        }
}
