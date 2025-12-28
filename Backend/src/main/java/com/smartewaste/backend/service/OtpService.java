package com.smartewaste.backend.service;

import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final UserAccountRepository userAccountRepository;
    private final EmailService emailService;

    public OtpService(UserAccountRepository userAccountRepository, EmailService emailService) {
        this.userAccountRepository = userAccountRepository;
        this.emailService = emailService;
    }

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Find existing user (even if PENDING) or create a temporary record if we were
        // using a temp table.
        // But for this flow, we will assume we update the OTP on the existing email
        // record
        // OR we might need to handle "New Registration" differently.
        // For simplicity: We will rely on the Controller to ensure the UserAccount
        // exists (or create a shell one).

        Optional<UserAccount> userOpt = userAccountRepository.findByEmailIgnoreCase(email);
        UserAccount user;

        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // If user doesn't exist, we can't save OTP to them.
            // But verify-email flow usually happens BEFORE account creation.
            // HACK for PROJECT: We will require the user to hit 'Register' first to create
            // the account,
            // or we create a "shell" account here.
            // BETTER: The registration form calls "/send-otp". We can't save to DB if no
            // record.
            // SOLUTION: Create a "PENDING_VERIFICATION" user shell.
            user = new UserAccount();
            user.setEmail(email);
            user.setUsername(email); // Temporary
            user.setFullName("Guest");
            user.setStatus(com.smartewaste.backend.enums.UserStatus.PENDING);
        }

        user.setOtp(otp);
        user.setOtpExpiry(Instant.now().plusSeconds(300)); // 5 mins
        userAccountRepository.save(user);

        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<UserAccount> userOpt = userAccountRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty())
            return false;

        UserAccount user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiry() == null)
            return false;

        if (Instant.now().isAfter(user.getOtpExpiry())) {
            return false;
        }

        if (user.getOtp().equals(otp)) {
            // NOTE: We do NOT clear the OTP here. We only confirm it matches.
            // The OTP will be consumed and cleared during the final 'registerUser' call.
            // user.setOtp(null);
            // user.setOtpExpiry(null);

            // Mark as verified if purely just verifying email
            // (Actual status change might happen at final registration submit)
            // userAccountRepository.save(user); // No need to save if we aren't changing
            // anything yet
            return true;
        }

        return false;
    }
}
