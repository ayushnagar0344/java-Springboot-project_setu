package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.service.LawyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lawyers")
@RequiredArgsConstructor
public class LawyerController {

    private final LawyerService lawyerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Lawyer>>> getAllLawyers() {
        List<Lawyer> lawyers = lawyerService.getAllLawyers();
        return ResponseEntity.ok(ApiResponse.success("Lawyers retrieved successfully", lawyers));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Lawyer>>> searchLawyers(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean isOnline) {
        
        List<Lawyer> lawyers = lawyerService.searchLawyers(specialization, city, isOnline);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", lawyers));
    }
}
