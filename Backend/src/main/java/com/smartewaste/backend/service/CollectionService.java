package com.smartewaste.backend.service;

import com.smartewaste.backend.entity.CollectionRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.repository.CollectionRequestRepository;
import com.smartewaste.backend.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class CollectionService {

    private final CollectionRequestRepository requestRepository;
    private final UserAccountRepository userRepository;
    private final EmailService emailService;

    // Directory to save uploaded images
    private final String UPLOAD_DIR = "uploads/";

    public CollectionService(CollectionRequestRepository requestRepository,
                             UserAccountRepository userRepository,
                             EmailService emailService) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public CollectionRequest createRequest(
            String username,
            String deviceType,
            String brand,
            String model,
            String condition,
            Integer quantity,
            String address,
            String remarks,
            LocalDate pickupDate,
            LocalTime pickupTime,
            MultipartFile image) throws IOException {

        UserAccount user = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CollectionRequest request = new CollectionRequest();
        request.setUser(user);
        request.setDeviceType(deviceType);
        request.setBrand(brand);
        request.setModel(model);
        request.setCondition(condition);
        request.setQuantity(quantity);
        request.setAddress(address);
        request.setRemarks(remarks);
        request.setPickupDate(pickupDate);
        request.setPickupTime(pickupTime);

        // Handle Image Upload
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, image.getBytes());
            request.setImagePath(fileName);
        }

        return requestRepository.save(request);
    }

    public List<CollectionRequest> getMyRequests(String username) {
        UserAccount user = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // ✅ Get Requests Assigned to Personnel
    public List<CollectionRequest> getAssignedRequests(String username) {
        UserAccount user = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // We match by the Full Name stored in request's pickupPersonnel field
        return requestRepository.findByPickupPersonnel(user.getFullName());
    }

    // ✅ Update Request Status
    public CollectionRequest updateRequestStatus(Long requestId, String status) {
        CollectionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        RequestStatus newStatus = RequestStatus.valueOf(status.toUpperCase());
        request.setStatus(newStatus);
        CollectionRequest saved = requestRepository.save(request);

        if (newStatus == RequestStatus.COMPLETED && request.getUser() != null) {
            emailService.sendPickupCompletedEmail(
                    request.getUser().getEmail(),
                    request.getUser().getFullName(),
                    request.getDeviceType(),
                    request.getPickupDate(),
                    request.getPickupTime());
        }

        return saved;
    }
}
