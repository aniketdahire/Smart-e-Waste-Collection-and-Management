package com.smartewaste.backend.service;

import com.smartewaste.backend.dto.AdminProfileDto;
import com.smartewaste.backend.dto.RegisterUserRequest;
import com.smartewaste.backend.dto.UpdateProfileRequest;
import com.smartewaste.backend.dto.UserSummaryDto;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.entity.UserDocument;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.UserAccountRepository;
import com.smartewaste.backend.repository.UserDocumentRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final EmailService emailService;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(
            UserAccountRepository userAccountRepository,
            UserDocumentRepository userDocumentRepository,
            EmailService emailService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.userDocumentRepository = userDocumentRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // ============================
    // PUBLIC REGISTRATION
    // ============================
    // ✅ MODIFIED: Creates PENDING user. Verification happens later.
    public UserAccount registerUser(RegisterUserRequest request) {

        if (userAccountRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        UserAccount user = new UserAccount();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getEmail());
        user.setStatus(UserStatus.PENDING);
        user.setCreatedAt(Instant.now());
        user.getRoles().add("ROLE_USER");

        return userAccountRepository.save(user);
    }

    // ============================
    // USER PROFILE
    // ============================

    public UserAccount getProfile(String email) {
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void verifyUser(String email, String otp) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (Instant.now().isAfter(user.getOtpExpiry())) {
            throw new RuntimeException("OTP Expired");
        }

        user.setStatus(UserStatus.VERIFIED);
        user.setOtp(null);
        user.setOtpExpiry(null);

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setMustResetPassword(true);

        userAccountRepository.save(user);
        emailService.sendCredentialsEmail(user.getEmail(), user.getFullName(), tempPassword);
    }

    public UserSummaryDto getUserSummary(String email) {
        UserAccount user = userAccountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserSummaryDto.fromEntity(user);
    }

    public void updateProfile(
            String email,
            UpdateProfileRequest request,
            MultipartFile idProof,
            MultipartFile addressProof) throws IOException {

        UserAccount user = getProfile(email);

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setAddress(request.getAddress());

        userAccountRepository.save(user);

        if (idProof != null && !idProof.isEmpty()) {
            saveDocument(user, idProof, "ID_PROOF");
        }

        if (addressProof != null && !addressProof.isEmpty()) {
            saveDocument(user, addressProof, "ADDRESS_PROOF");
        }
    }

    // ============================
    // ADMIN FUNCTIONS
    // ============================

    public List<UserSummaryDto> getAllUsers() {
        return userAccountRepository.findAll()
                .stream()
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserAccount approveUser(
            Long userId,
            boolean approve,
            String encodedTempPassword) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (approve) {
            user.setStatus(UserStatus.VERIFIED);
            user.setPassword(encodedTempPassword);
            user.setMustResetPassword(true);
        } else {
            user.setStatus(UserStatus.REJECTED);
        }

        return userAccountRepository.save(user);
    }

    public void updateUserStatus(Long userId, UserStatus status) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userAccountRepository.save(user);
    }

    public void deleteUser(Long userId) {
        if (!userAccountRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userAccountRepository.deleteById(userId);
    }

    public String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public void sendCredentials(UserAccount user, String rawTempPassword) {
        emailService.sendCredentialsEmail(
                user.getEmail(),
                user.getFullName(),
                rawTempPassword);
    }

    // ============================
    // ADMIN PROFILE
    // ============================

    public AdminProfileDto getAdminProfile(String username) {

        UserAccount admin = getProfileByUsername(username);

        AdminProfileDto dto = new AdminProfileDto();
        dto.setId(admin.getId());
        dto.setFullName(admin.getFullName());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setPhone(admin.getPhone());
        dto.setAddress(admin.getAddress());
        dto.setCity(admin.getCity());

        return dto;
    }

    public AdminProfileDto updateAdminProfile(String username, AdminProfileDto dto) {

        UserAccount admin = getProfileByUsername(username);

        admin.setFullName(dto.getFullName());
        admin.setPhone(dto.getPhone());
        admin.setAddress(dto.getAddress());
        admin.setCity(dto.getCity());

        userAccountRepository.save(admin);

        return getAdminProfile(username);
    }

    // ============================
    // HELPER METHODS
    // ============================

    public UserAccount getProfileByUsername(String username) {
        return userAccountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void save(UserAccount user) {
        userAccountRepository.save(user);
    }

    // ============================
    // INTERNAL FILE HANDLING
    // ============================

    private void saveDocument(
            UserAccount user,
            MultipartFile file,
            String type) throws IOException {

        UserDocument document = new UserDocument();
        document.setUser(user);
        document.setType(type);
        document.setFileName(file.getOriginalFilename());
        document.setContentType(file.getContentType());
        document.setData(file.getBytes());

        userDocumentRepository.save(document);
    }
}
