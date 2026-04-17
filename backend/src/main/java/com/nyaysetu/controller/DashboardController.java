package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.dto.LawyerDashboardResponse;
import com.nyaysetu.dto.UserDashboardResponse;
import com.nyaysetu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard() {
        String phoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ApiResponse.success("User dashboard retrieved", dashboardService.getUserDashboard(phoneNumber)));
    }

    @GetMapping("/lawyer")
    public ResponseEntity<ApiResponse<LawyerDashboardResponse>> getLawyerDashboard() {
        String phoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ApiResponse.success("Lawyer dashboard retrieved", dashboardService.getLawyerDashboard(phoneNumber)));
    }
}
