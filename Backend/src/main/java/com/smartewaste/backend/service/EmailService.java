package com.smartewaste.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ================= COMMON HTML EMAIL SENDER =================
    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ HTML EMAIL SENT TO: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ EMAIL FAILED: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ================= BASE EMAIL TEMPLATE =================
    private String baseTemplate(String title, String content) {
        return "<html>" +
                "<body style='margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f6f8;'>" +
                "<div style='max-width:600px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden;'>"
                +

                "<div style='background:#2e7d32; padding:20px; text-align:center; color:#ffffff;'>" +
                "<h2 style='margin:0;'>Smart E-Waste</h2>" +
                "<p style='margin:5px 0 0;'>Responsible Recycling for a Greener Future</p>" +
                "</div>" +

                "<div style='padding:25px; color:#333;'>" +
                "<h3 style='color:#2e7d32;'>" + title + "</h3>" +
                content +
                "</div>" +

                "<div style='background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;'>" +
                "© 2026 Smart E-Waste | All Rights Reserved" +
                "</div>" +

                "</div>" +
                "</body>" +
                "</html>";
    }

    // ================= ACCOUNT APPROVAL =================
    public void sendCredentialsEmail(String email, String name, String password) {

        String content = "<p>Hello <b>" + name + "</b>,</p>" +
                "<p>Your account has been approved successfully.</p>" +
                "<div style='background:#e8f5e9; padding:15px; border-left:4px solid #2e7d32;'>" +
                "<p><b>Temporary Password:</b></p>" +
                "<p style='font-size:18px;'><b>" + password + "</b></p>" +
                "</div>" +
                "<p>Please log in and change your password immediately.</p>";

        sendHtmlEmail(
                email,
                "Welcome to Smart E-Waste – Account Approved",
                baseTemplate("Account Approved", content));
    }

    // ================= OTP EMAIL =================
    public void sendOtpEmail(String email, String otp) {

        String content = "<p>Your One-Time Password (OTP) is:</p>" +
                "<div style='text-align:center; margin:20px 0;'>" +
                "<span style='font-size:26px; letter-spacing:6px; color:#2e7d32;'><b>" + otp + "</b></span>" +
                "</div>" +
                "<p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>";

        sendHtmlEmail(
                email,
                "Your OTP for Smart E-Waste Verification",
                baseTemplate("OTP Verification", content));
    }

    // ================= PICKUP SCHEDULED =================
    public void sendPickupScheduledEmail(
            String email,
            String userName,
            LocalDate date,
            LocalTime time,
            String personnel) {

        String content = "<p>Dear <b>" + userName + "</b>,</p>" +
                "<p>Your e-waste pickup has been successfully scheduled.</p>" +
                "<table style='width:100%; border-collapse:collapse;'>" +
                "<tr><td><b>Date:</b></td><td>" + date + "</td></tr>" +
                "<tr><td><b>Time:</b></td><td>" + time + "</td></tr>" +
                "<tr><td><b>Personnel:</b></td><td>" + personnel + "</td></tr>" +
                "</table>" +
                "<p>Please keep the items ready for collection.</p>";

        sendHtmlEmail(
                email,
                "Your E-Waste Pickup Is Scheduled",
                baseTemplate("Pickup Scheduled", content));
    }

    // ================= REQUEST REJECTED =================
    public void sendRequestRejectedEmail(String email, String userName, String reason) {

        String content = "<p>Dear <b>" + userName + "</b>,</p>" +
                "<p>Unfortunately, your pickup request was not approved.</p>" +
                "<div style='background:#fdecea; padding:15px; border-left:4px solid #d32f2f;'>" +
                "<p><b>Reason:</b></p>" +
                "<p>" + reason + "</p>" +
                "</div>" +
                "<p>You may submit a new request anytime.</p>";

        sendHtmlEmail(
                email,
                "Update on Your Pickup Request",
                baseTemplate("Request Rejected", content));
    }

    // ================= PERSONNEL WELCOME =================
    public void sendPersonnelWelcomeEmail(String email, String name, String password) {

        String content = "<p>Dear <b>" + name + "</b>,</p>" +
                "<p>You have been successfully onboarded as Smart E-Waste staff.</p>" +
                "<div style='background:#e3f2fd; padding:15px;'>" +
                "<p><b>Email:</b> " + email + "</p>" +
                "<p><b>Password:</b> " + password + "</p>" +
                "</div>" +
                "<p>Please change your password after first login.</p>";

        sendHtmlEmail(
                email,
                "Welcome to Smart E-Waste Team",
                baseTemplate("Welcome Aboard", content));
    }

    // ================= PASSWORD CHANGED CONFIRMATION =================
    public void sendPasswordChangedConfirmation(String email, String userName) {

        String content = "<p>Dear <b>" + userName + "</b>,</p>" +
                "<p>Your Smart E-Waste account password has been changed successfully.</p>" +
                "<p>If you did not perform this action, please contact our support team immediately.</p>";

        sendHtmlEmail(
                email,
                "Password Changed Successfully – Smart E-Waste",
                baseTemplate("Password Changed", content));
    }

}
