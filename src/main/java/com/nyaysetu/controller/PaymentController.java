package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.dto.PaymentCreateRequest;
import com.nyaysetu.dto.PaymentResponse;
import com.nyaysetu.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentCreateRequest request) {
        PaymentResponse responsePayload = paymentService.createPayment(request.getConsultationId(), request.getAmount());
        ApiResponse<PaymentResponse> response = ApiResponse.success("Payment initialized successfully", responsePayload);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/success/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> markSuccess(
            @PathVariable("paymentId") String paymentId,
            @AuthenticationPrincipal String userPhoneNumber) {
        
        PaymentResponse responsePayload = paymentService.markPaymentSuccess(paymentId, userPhoneNumber);
        ApiResponse<PaymentResponse> response = ApiResponse.success("Payment marked as SUCCESS", responsePayload);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/fail/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> markFailed(
            @PathVariable("paymentId") String paymentId,
            @AuthenticationPrincipal String userPhoneNumber) {
        
        PaymentResponse responsePayload = paymentService.markPaymentFailed(paymentId, userPhoneNumber);
        ApiResponse<PaymentResponse> response = ApiResponse.success("Payment marked as FAILED", responsePayload);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(
            @PathVariable("consultationId") Long consultationId,
            @AuthenticationPrincipal String userPhoneNumber) {
        
        PaymentResponse responsePayload = paymentService.getPaymentByConsultationId(consultationId, userPhoneNumber);
        ApiResponse<PaymentResponse> response = ApiResponse.success("Payment retrieved", responsePayload);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments(@AuthenticationPrincipal String userPhoneNumber) {
        List<PaymentResponse> payments = paymentService.getMyPayments(userPhoneNumber);
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved", payments));
    }
}
