package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.entity.*;
import com.nyaysetu.repository.LawyerApplicationRepository;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.UserRepository;
import com.nyaysetu.service.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final LawyerApplicationRepository applicationRepository;
    private final LawyerRepository lawyerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityAuditService auditService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<LawyerApplication>> apply(@Valid @RequestBody LawyerApplication application) {
        application.setStatus(ApplicationStatus.PENDING);
        LawyerApplication saved = applicationRepository.save(application);
        return ResponseEntity.ok(ApiResponse.success("Application submitted for judicial review", saved));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LawyerApplication>>> getPending() {
        return ResponseEntity.ok(ApiResponse.success("Pending applications retrieved", 
                applicationRepository.findByStatus(ApplicationStatus.PENDING)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> approve(@PathVariable Long id, Principal principal) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(ApplicationStatus.APPROVED);
            applicationRepository.save(app);

            // 1. Create Lawyer Entity
            Lawyer lawyer = Lawyer.builder()
                    .name(app.getName())
                    .specialization(app.getSpecialization())
                    .phoneNumber(app.getPhoneNumber())
                    .city(app.getCity())
                    .experienceYears(app.getExperienceYears())
                    .rating(5.0) // Initial rating
                    .isOnline(false)
                    .build();
            lawyerRepository.save(lawyer);

            // 2. Create User Account
            if (!userRepository.existsByPhoneNumber(app.getPhoneNumber())) {
                User user = User.builder()
                        .name(app.getName())
                        .phoneNumber(app.getPhoneNumber())
                        .password(passwordEncoder.encode("lawyer123"))
                        .role(Role.LAWYER)
                        .email(app.getEmail())
                        .build();
                userRepository.save(user);
            }

            auditService.logAction("LAWYER_APPROVED", principal.getName(), 
                    "Approved lawyer: " + app.getName() + " (Phone: " + app.getPhoneNumber() + ")");

            return ResponseEntity.ok(ApiResponse.success("Lawyer approved and account generated", "SUCCESS"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> reject(@PathVariable Long id, Principal principal) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(ApplicationStatus.REJECTED);
            applicationRepository.save(app);
            auditService.logAction("LAWYER_REJECTED", principal.getName(), "Rejected: " + app.getName());
            return ResponseEntity.ok(ApiResponse.success("Application rejected", "REJECTED"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
