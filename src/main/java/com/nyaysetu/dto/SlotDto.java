package com.nyaysetu.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SlotDto {
    private Long id;
    private Long lawyerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isBooked;
}
