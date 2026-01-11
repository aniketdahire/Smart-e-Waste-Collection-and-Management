package com.smartewaste.backend.service;

import com.smartewaste.backend.entity.Personnel;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.PersonnelRepository;
import com.smartewaste.backend.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.smartewaste.backend.entity.Personnel;
import com.smartewaste.backend.repository.PersonnelRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PersonnelService {

    private final PersonnelRepository personnelRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PersonnelService(
            PersonnelRepository personnelRepository,
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.personnelRepository = personnelRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public List<Personnel> getAllActivePersonnel() {
        return personnelRepository.findByActiveTrue();
    }

    public Personnel addPersonnel(Personnel personnel) {
        personnel.setActive(true);

        // Auto-generate password: First 4 chars of Name + Pincode
        String namePart = personnel.getName().replaceAll("\\s+", ""); // Remove spaces
        if (namePart.length() > 4) {
            namePart = namePart.substring(0, 4);
        }
        String pincodePart = personnel.getPincode() != null ? personnel.getPincode() : "000000";
        String generatedPassword = namePart + pincodePart;

        personnel.setPassword(generatedPassword);
        Personnel savedPersonnel = personnelRepository.save(personnel);

        // ✅ AUTO-CREATE USER ACCOUNT FOR LOGIN
        if (personnel.getEmail() != null && !personnel.getEmail().isEmpty()) {
            if (userAccountRepository.findByEmailIgnoreCase(personnel.getEmail()).isEmpty()) {
                UserAccount user = new UserAccount();
                user.setFullName(personnel.getName());
                user.setEmail(personnel.getEmail());
                user.setUsername(personnel.getEmail()); // Use email as username
                user.setPhone(personnel.getPhone());
                user.setAddress(personnel.getAddress());
                user.setPassword(passwordEncoder.encode(generatedPassword));
                user.setStatus(UserStatus.VERIFIED);
                user.setRoles(Collections.singleton("ROLE_PERSONNEL")); // New Role

                userAccountRepository.save(user);

                // ✅ SEND CREDENTIALS VIA EMAIL
                emailService.sendPersonnelWelcomeEmail(personnel.getEmail(), personnel.getName(), generatedPassword);
            }
        }

        return savedPersonnel;
    }

    public void deletePersonnel(long id) {
        personnelRepository.findById(id).ifPresent(p -> {
            p.setActive(false);
            personnelRepository.save(p);

            // Optional: Deactivate linked user account if needed
            if (p.getEmail() != null) {
                userAccountRepository.findByEmailIgnoreCase(p.getEmail()).ifPresent(u -> {
                    u.setStatus(UserStatus.SUSPENDED);
                    userAccountRepository.save(u);
                });
            }
        });
    }
}
