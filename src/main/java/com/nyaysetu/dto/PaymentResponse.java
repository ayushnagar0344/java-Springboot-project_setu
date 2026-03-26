package com.nyaysetu.dto;

import com.nyaysetu.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long consultationId;
    private Double amount;
    private PaymentStatus status;
    private String paymentId;
    private LocalDateTime createdAt;
}
