package com.nyaysetu.service;

import com.nyaysetu.dto.SettlementRequest;
import com.nyaysetu.dto.SettlementResponse;
import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.entity.Settlement;
import com.nyaysetu.entity.SettlementStatus;
import com.nyaysetu.exception.ResourceNotFoundException;
import com.nyaysetu.exception.UnauthorizedAccessException;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final LawyerRepository lawyerRepository;

    public SettlementResponse raiseSettlement(String phone, SettlementRequest request) {
        // Randomly assign an active lawyer
        List<Lawyer> lawyers = lawyerRepository.findAll();
        if (lawyers.isEmpty()) {
            throw new ResourceNotFoundException("No lawyers available to assign. Please try again later.");
        }
        Lawyer assigned = lawyers.get(new Random().nextInt(lawyers.size()));

        Settlement settlement = Settlement.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .raisedByPhone(phone)
                .oppositionName(request.getOppositionName())
                .oppositionContact(request.getOppositionContact())
                .assignedLawyerId(assigned.getId())
                .assignedLawyerName(assigned.getName())
                .status(SettlementStatus.LAWYER_ASSIGNED)
                .build();

        Settlement saved = settlementRepository.save(settlement);
        log.info("Settlement raised by {} and assigned to lawyer {}", phone, assigned.getName());
        return toResponse(saved);
    }

    public SettlementResponse sendNotice(String lawyerPhone, Long settlementId, String message) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found"));

        Lawyer lawyer = lawyerRepository.findByPhoneNumber(lawyerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found"));

        if (!settlement.getAssignedLawyerId().equals(lawyer.getId())) {
            throw new UnauthorizedAccessException("You are not assigned to this settlement");
        }

        settlement.setNoticeMessage(message);
        settlement.setStatus(SettlementStatus.NOTICE_SENT);
        log.info("Notice sent by lawyer {} for settlement {}", lawyerPhone, settlementId);
        return toResponse(settlementRepository.save(settlement));
    }

    public SettlementResponse updateStatus(String lawyerPhone, Long settlementId, SettlementStatus newStatus) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found"));

        Lawyer lawyer = lawyerRepository.findByPhoneNumber(lawyerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found"));

        if (!settlement.getAssignedLawyerId().equals(lawyer.getId())) {
            throw new UnauthorizedAccessException("You are not assigned to this settlement");
        }

        settlement.setStatus(newStatus);
        if (newStatus == SettlementStatus.RESOLVED || newStatus == SettlementStatus.CLOSED) {
            settlement.setResolvedAt(LocalDateTime.now());
        }
        return toResponse(settlementRepository.save(settlement));
    }

    public List<SettlementResponse> getUserSettlements(String phone) {
        return settlementRepository.findByRaisedByPhoneOrderByCreatedAtDesc(phone)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SettlementResponse> getLawyerSettlements(String lawyerPhone) {
        Lawyer lawyer = lawyerRepository.findByPhoneNumber(lawyerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found"));
        return settlementRepository.findByAssignedLawyerIdOrderByCreatedAtDesc(lawyer.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SettlementResponse> getAllSettlements() {
        return settlementRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private SettlementResponse toResponse(Settlement s) {
        return SettlementResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .description(s.getDescription())
                .raisedByPhone(s.getRaisedByPhone())
                .oppositionName(s.getOppositionName())
                .oppositionContact(s.getOppositionContact())
                .assignedLawyerId(s.getAssignedLawyerId())
                .assignedLawyerName(s.getAssignedLawyerName())
                .status(s.getStatus())
                .noticeMessage(s.getNoticeMessage())
                .createdAt(s.getCreatedAt())
                .resolvedAt(s.getResolvedAt())
                .build();
    }
}
