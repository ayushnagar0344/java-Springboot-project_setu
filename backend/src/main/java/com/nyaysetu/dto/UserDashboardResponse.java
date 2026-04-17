package com.nyaysetu.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserDashboardResponse {
    private long totalConsultations;
    private long pendingPayments;
    private long bookedConsultations;
    private List<ConsultationResponse> recentConsultations;
}
