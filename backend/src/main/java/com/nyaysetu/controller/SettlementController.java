package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.dto.SettlementRequest;
import com.nyaysetu.dto.SettlementResponse;
import com.nyaysetu.entity.SettlementStatus;
import com.nyaysetu.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @PostMapping
    public ResponseEntity<ApiResponse<SettlementResponse>> raiseSettlement(
            Authentication auth,
            @RequestBody SettlementRequest request) {
        SettlementResponse response = settlementService.raiseSettlement(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.<SettlementResponse>builder()
                .success(true).message("Settlement raised and lawyer assigned.").data(response).build());
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<SettlementResponse>>> getMySettlements(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.<List<SettlementResponse>>builder()
                .success(true).data(settlementService.getUserSettlements(auth.getName())).build());
    }

    @GetMapping("/lawyer")
    public ResponseEntity<ApiResponse<List<SettlementResponse>>> getLawyerSettlements(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.<List<SettlementResponse>>builder()
                .success(true).data(settlementService.getLawyerSettlements(auth.getName())).build());
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SettlementResponse>>> getAllSettlements() {
        return ResponseEntity.ok(ApiResponse.<List<SettlementResponse>>builder()
                .success(true).data(settlementService.getAllSettlements()).build());
    }

    @PutMapping("/{id}/notice")
    public ResponseEntity<ApiResponse<SettlementResponse>> sendNotice(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        SettlementResponse response = settlementService.sendNotice(auth.getName(), id, body.get("message"));
        return ResponseEntity.ok(ApiResponse.<SettlementResponse>builder()
                .success(true).message("Notice sent to opposition.").data(response).build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SettlementResponse>> updateStatus(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        SettlementStatus status = SettlementStatus.valueOf(body.get("status"));
        SettlementResponse response = settlementService.updateStatus(auth.getName(), id, status);
        return ResponseEntity.ok(ApiResponse.<SettlementResponse>builder()
                .success(true).message("Status updated.").data(response).build());
    }
}
