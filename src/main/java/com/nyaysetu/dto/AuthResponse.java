package com.nyaysetu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String message;
    private String name;
    private String phoneNumber;
    private String role;
}
