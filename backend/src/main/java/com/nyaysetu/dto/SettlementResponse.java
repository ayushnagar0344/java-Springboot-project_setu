package com.nyaysetu.dto;

import com.nyaysetu.entity.SettlementStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementResponse {
    private Long id;
    private String title;
    private String description;
    private String raisedByPhone;
    private String oppositionName;
    private String oppositionContact;
    private Long assignedLawyerId;
    private String assignedLawyerName;
    private SettlementStatus status;
    private String noticeMessage;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
