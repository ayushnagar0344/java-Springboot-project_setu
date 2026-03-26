package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.dto.SlotCreateRequest;
import com.nyaysetu.dto.SlotDto;
import com.nyaysetu.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<SlotDto>>> createSlots(@Valid @RequestBody SlotCreateRequest request) {
        String requesterPhoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        
        List<SlotDto> createdSlots = slotService.createSlots(
                request.getLawyerId(), 
                request.getStartTimes(),
                requesterPhoneNumber
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Slots created successfully", createdSlots));
    }

    @GetMapping("/{lawyerId}")
    public ResponseEntity<ApiResponse<List<SlotDto>>> getAvailableSlotsLegacy(
            @PathVariable("lawyerId") Long lawyerId,
            @RequestParam(required = false) LocalDate date) {
        return getAvailableSlots(lawyerId, date);
    }

    @GetMapping("/lawyer/{lawyerId}")
    public ResponseEntity<ApiResponse<List<SlotDto>>> getAvailableSlots(
            @PathVariable("lawyerId") Long lawyerId,
            @RequestParam(required = false) LocalDate date) {
        
        List<SlotDto> slots;
        if (date != null) {
            slots = slotService.getSlotsByLawyerAndDate(lawyerId, date);
        } else {
            slots = slotService.getAvailableSlots(lawyerId);
        }
        return ResponseEntity.ok(ApiResponse.success("Slots retrieved successfully", slots));
    }
    
    // Note: bookSlot functionality would typically be invoked during Consultation booking
    // so I will leave this as an internal API service that could be called if needed directly:
    @PutMapping("/book/{slotId}")
    public ResponseEntity<ApiResponse<SlotDto>> markSlotAsBooked(@PathVariable("slotId") Long slotId) {
        SlotDto slotDto = slotService.bookSlot(slotId);
        return ResponseEntity.ok(ApiResponse.success("Slot marked as booked successfully", slotDto));
    }
}
