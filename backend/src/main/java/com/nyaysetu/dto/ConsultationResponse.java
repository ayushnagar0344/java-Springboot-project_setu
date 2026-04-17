package com.nyaysetu.dto;

import com.nyaysetu.entity.ConsultationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConsultationResponse {
    private Long id;
    private Long lawyerId;
    private Long slotId;
    private String lawyerName; 
    private LocalDateTime consultationTime;
    private ConsultationStatus status;
    private LocalDateTime createdAt;
    private String meetingLink;
}
