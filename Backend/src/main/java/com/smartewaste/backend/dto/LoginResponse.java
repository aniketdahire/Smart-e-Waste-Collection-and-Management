package com.smartewaste.backend.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private boolean mustResetPassword;
    private String role;
    private String token;

    // ✅ REQUIRED constructor (THIS FIXES THE ERROR)
    public LoginResponse(boolean success,
                         String message,
                         boolean mustResetPassword,
                         String role,
                         String token) {
        this.success = success;
        this.message = message;
        this.mustResetPassword = mustResetPassword;
        this.role = role;
        this.token = token;
    }

    // ✅ Default constructor (important for Jackson)
    public LoginResponse() {}

    // ✅ Getters & Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isMustResetPassword() {
        return mustResetPassword;
    }

    public void setMustResetPassword(boolean mustResetPassword) {
        this.mustResetPassword = mustResetPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
