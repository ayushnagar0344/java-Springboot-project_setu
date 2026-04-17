package com.nyaysetu.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LawyerDashboardResponse {
    private long totalConsultations;
    private long upcomingConsultations;
    private double totalEarnings;
    private long availableSlotsToday;
    private List<ConsultationResponse> recentConsultations;
}
