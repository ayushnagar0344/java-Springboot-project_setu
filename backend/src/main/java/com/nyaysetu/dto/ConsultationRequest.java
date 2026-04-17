package com.nyaysetu.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConsultationRequest {

    @NotNull(message = "Slot ID is required")
    private Long slotId;
}
