package com.nyaysetu.service;

import com.nyaysetu.dto.ConsultationResponse;
import com.nyaysetu.dto.LawyerDashboardResponse;
import com.nyaysetu.dto.UserDashboardResponse;
import com.nyaysetu.entity.Consultation;
import com.nyaysetu.entity.ConsultationStatus;
import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.entity.PaymentStatus;
import com.nyaysetu.repository.ConsultationRepository;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.PaymentRepository;
import com.nyaysetu.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ConsultationRepository consultationRepository;
    private final PaymentRepository paymentRepository;
    private final LawyerRepository lawyerRepository;
    private final SlotRepository slotRepository;

    public UserDashboardResponse getUserDashboard(String phoneNumber) {
        long total = consultationRepository.countByUserPhoneNumber(phoneNumber);
        long pending = consultationRepository.countByUserPhoneNumberAndStatus(phoneNumber, ConsultationStatus.PENDING_PAYMENT);
        long booked = consultationRepository.countByUserPhoneNumberAndStatus(phoneNumber, ConsultationStatus.BOOKED);
        
        List<ConsultationResponse> recent = consultationRepository.findByUserPhoneNumberOrderByCreatedAtDesc(phoneNumber, PageRequest.of(0, 5))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return UserDashboardResponse.builder()
                .totalConsultations(total)
                .pendingPayments(pending)
                .bookedConsultations(booked)
                .recentConsultations(recent)
                .build();
    }

    public LawyerDashboardResponse getLawyerDashboard(String phoneNumber) {
        Lawyer lawyer = lawyerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Lawyer profile not found for phone: " + phoneNumber));

        long total = consultationRepository.countByLawyerId(lawyer.getId());
        long upcoming = consultationRepository.countByLawyerIdAndStatus(lawyer.getId(), ConsultationStatus.BOOKED);
        
        List<Consultation> lawyerConsultations = consultationRepository.findByLawyerId(lawyer.getId());
        List<Long> consultationIds = lawyerConsultations.stream().map(Consultation::getId).collect(Collectors.toList());
        
        Double earnings = 0.0;
        if (!consultationIds.isEmpty()) {
            earnings = paymentRepository.sumAmountByStatusAndConsultationIds(PaymentStatus.SUCCESS, consultationIds);
            if (earnings == null) earnings = 0.0;
        }

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        long availableSlotsToday = slotRepository.findByLawyerIdAndStartTimeBetweenOrderByStartTimeAsc(lawyer.getId(), startOfDay, endOfDay)
                .stream()
                .filter(s -> !s.isBooked())
                .count();

        List<ConsultationResponse> recent = consultationRepository.findByLawyerIdOrderByCreatedAtDesc(lawyer.getId(), PageRequest.of(0, 5))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return LawyerDashboardResponse.builder()
                .totalConsultations(total)
                .upcomingConsultations(upcoming)
                .totalEarnings(earnings)
                .availableSlotsToday(availableSlotsToday)
                .recentConsultations(recent)
                .build();
    }

    private ConsultationResponse mapToResponse(Consultation c) {
        String lawyerName = lawyerRepository.findById(c.getLawyerId()).map(Lawyer::getName).orElse("Unknown");
        LocalDateTime time = slotRepository.findById(c.getSlotId()).map(s -> s.getStartTime()).orElse(null);
        
        return ConsultationResponse.builder()
                .id(c.getId())
                .lawyerId(c.getLawyerId())
                .slotId(c.getSlotId())
                .lawyerName(lawyerName)
                .consultationTime(time)
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .meetingLink(c.getMeetingLink())
                .build();
    }
}
