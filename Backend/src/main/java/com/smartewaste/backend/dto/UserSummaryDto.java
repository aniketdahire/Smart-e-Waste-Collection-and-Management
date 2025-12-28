package com.smartewaste.backend.dto;

import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;

public class UserSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserStatus status;

    private String city;      // ✅ Added
    private String address;   // ✅ Added

    // ===================== GETTERS =====================
    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public UserStatus getStatus() {
        return status;
    }

    public String getCity() {
        return city;
    }

    public String getAddress() {
        return address;
    }

    // ===================== SETTERS =====================
    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // ===================== MAPPER =====================
    public static UserSummaryDto fromEntity(UserAccount user) {
        UserSummaryDto dto = new UserSummaryDto();

        dto.id = user.getId();
        dto.fullName = user.getFullName();
        dto.email = user.getEmail();
        dto.phone = user.getPhone();
        dto.status = user.getStatus();

        dto.city = user.getCity();        // ✅ Now included
        dto.address = user.getAddress();  // ✅ Now included

        return dto;
    }
}
