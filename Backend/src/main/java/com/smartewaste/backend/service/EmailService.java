package com.smartewaste.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ✅ SEND TEMP CREDENTIALS (ADMIN APPROVAL)
    public void sendCredentialsEmail(
            String email,
            String fullName,
            String tempPassword) {
        try {
            System.out.println("\n==================================================");
            System.out.println("📧 PREPARING EMAIL FOR: " + email);
            System.out.println("🔑 TEMPORARY PASSWORD (DEBUG): " + tempPassword); // ✅ ADDED THIS
            System.out.println("==================================================");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Smart E-Waste Account Credentials");
            message.setText(
                    "Hello " + fullName + ",\n\n" +
                            "Your account has been approved by the admin.\n\n" +
                            "Temporary Password: " + tempPassword + "\n\n" +
                            "Please login and change your password immediately.\n\n" +
                            "Regards,\nSmart E-Waste Team");

            mailSender.send(message);

            System.out.println("✅ EMAIL SENT SUCCESSFULLY TO: " + email);
            System.out.println("==================================================\n");

        } catch (Exception e) {
            System.err.println("\n❌❌❌ EMAIL SENDING FAILED ❌❌❌");
            System.err.println("REASON: " + e.getMessage());
            e.printStackTrace();
            System.err.println("==================================================\n");
        }
    }

    // ✅ PASSWORD RESET CONFIRMATION
    public void sendPasswordChangedConfirmation(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Changed Successfully");

        message.setText(
                "Your password has been changed successfully.\n\n" +
                        "If this wasn't you, please contact support immediately.");

        mailSender.send(message);
    }

    // ✅ FORGOT PASSWORD EMAIL
    public void sendPasswordResetEmail(String email, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Your Password");

        message.setText(
                "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 30 minutes.");

        mailSender.send(message);
    }

    // ✅ OTP VERIFICATION EMAIL
    public void sendOtpEmail(String email, String otp) {
        try {
            System.out.println("\n--------------------------------------------------");
            System.out.println("📨 SENDING OTP TO: " + email);
            System.out.println("🔢 OTP CODE (DEBUG): " + otp);
            System.out.println("--------------------------------------------------");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Verification OTP");
            message.setText("Your OTP for verification is: " + otp + "\n\nThis OTP expires in 5 minutes.");

            mailSender.send(message);
            System.out.println("✅ OTP SENT SUCCESSFULLY");
        } catch (Exception e) {
            System.err.println("❌ FAILED TO SEND OTP: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
