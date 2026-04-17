package com.nyaysetu.service;

import com.nyaysetu.dto.AuthResponse;
import com.nyaysetu.dto.LoginRequest;
import com.nyaysetu.dto.SignupRequest;
import com.nyaysetu.entity.User;
import com.nyaysetu.entity.Role;
import com.nyaysetu.exception.BadRequestException;
import com.nyaysetu.repository.UserRepository;
import com.nyaysetu.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Phone number is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRepository.count() == 0 ? Role.ADMIN : Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .message("User registered successfully")
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for phone: {}", request.getPhoneNumber());
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> {
                    log.warn("User not found for phone: {}", request.getPhoneNumber());
                    return new BadRequestException("User not found with this phone number");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password for phone: {}", request.getPhoneNumber());
            throw new BadRequestException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}
