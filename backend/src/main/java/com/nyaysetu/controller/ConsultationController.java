package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.dto.ConsultationRequest;
import com.nyaysetu.dto.ConsultationResponse;
import com.nyaysetu.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<ConsultationResponse>> bookConsultation(@Valid @RequestBody ConsultationRequest request) {
        String userPhoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        
        ConsultationResponse responsePayload = consultationService.bookConsultation(
                userPhoneNumber, 
                request.getSlotId()
        );
        
        ApiResponse<ConsultationResponse> response = ApiResponse.success("Consultation booked successfully. Meeting link generated.", responsePayload);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getUserConsultations() {
        String userPhoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ConsultationResponse> responsePayload = consultationService.getUserConsultations(userPhoneNumber);
        ApiResponse<List<ConsultationResponse>> response = ApiResponse.success("Consultations retrieved successfully", responsePayload);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelConsultation(@PathVariable("id") Long id) {
        String userPhoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        consultationService.cancelConsultation(id, userPhoneNumber);
        ApiResponse<Void> response = ApiResponse.success("Consultation cancelled successfully", null);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}/join")
    public ResponseEntity<ApiResponse<String>> joinMeeting(@PathVariable("id") Long id) {
        String requesterPhoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        String meetingLink = consultationService.joinMeeting(id, requesterPhoneNumber);
        return ResponseEntity.ok(ApiResponse.success("Meeting link retrieved successfully", meetingLink));
    }
}
