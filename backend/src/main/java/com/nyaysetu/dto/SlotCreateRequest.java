package com.nyaysetu.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SlotCreateRequest {

    @NotNull(message = "Lawyer ID is required")
    private Long lawyerId;

    @NotEmpty(message = "Start times list cannot be empty")
    private List<LocalDateTime> startTimes;
}
