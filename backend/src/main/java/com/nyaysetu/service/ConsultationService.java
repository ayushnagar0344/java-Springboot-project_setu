package com.nyaysetu.service;

import com.nyaysetu.dto.ConsultationResponse;
import com.nyaysetu.entity.Consultation;
import com.nyaysetu.entity.ConsultationStatus;
import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.entity.Slot;
import com.nyaysetu.exception.ResourceNotFoundException;
import com.nyaysetu.exception.SlotAlreadyBookedException;
import com.nyaysetu.repository.ConsultationRepository;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final LawyerRepository lawyerRepository;
    private final SlotRepository slotRepository;
    private final PaymentService paymentService; // Inject PaymentService strictly

    public ConsultationResponse bookConsultation(String userPhoneNumber, Long slotId) {
        log.info("Attempting to book consultation for user: {} with slotId: {}", userPhoneNumber, slotId);
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        if (slot.isBooked()) {
            throw new SlotAlreadyBookedException("This slot is already booked.");
        }

        // Mark slot as booked
        slot.setBooked(true);
        slotRepository.save(slot);
        
        Lawyer lawyer = lawyerRepository.findById(slot.getLawyerId())
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found with id: " + slot.getLawyerId()));

        Consultation newConsultation = Consultation.builder()
                .userPhoneNumber(userPhoneNumber)
                .lawyerId(lawyer.getId())
                .slotId(slotId)
                .status(ConsultationStatus.PENDING_PAYMENT)
                .build();

        Consultation savedConsultation = consultationRepository.save(newConsultation);

        // Feature: Generate initial PENDING payment instance representing the standard consultation fee (e.g. 500)
        paymentService.createPayment(savedConsultation.getId(), 500.0);

        log.info("Consultation booked successfully. ID: {}, status: PENDING_PAYMENT", savedConsultation.getId());
        return mapToResponse(savedConsultation, lawyer.getName(), slot.getStartTime());
    }

    public List<ConsultationResponse> getUserConsultations(String userPhoneNumber) {
        List<Consultation> consultations = consultationRepository.findByUserPhoneNumber(userPhoneNumber);
        
        return consultations.stream().map(c -> {
            String lawyerName = lawyerRepository.findById(c.getLawyerId())
                    .map(Lawyer::getName)
                    .orElse("Unknown Lawyer");
                    
            LocalDateTime consultationTime = slotRepository.findById(c.getSlotId())
                    .map(Slot::getStartTime)
                    .orElse(null);
                    
            return mapToResponse(c, lawyerName, consultationTime);
        }).collect(Collectors.toList());
    }

    public void cancelConsultation(Long consultationId, String userPhoneNumber) {
        log.info("User {} is attempting to cancel consultation {}", userPhoneNumber, consultationId);
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found with id: " + consultationId));

        if (!consultation.getUserPhoneNumber().equals(userPhoneNumber)) {
            throw new ResourceNotFoundException("Consultation not found for the current user.");
        }

        // Mark consultation as cancelled
        consultation.setStatus(ConsultationStatus.CANCELLED);
        consultationRepository.save(consultation);
        log.info("Consultation {} cancelled successfully", consultationId);

        // Free up the slot
        slotRepository.findById(consultation.getSlotId()).ifPresent(slot -> {
            slot.setBooked(false);
            slotRepository.save(slot);
        });
    }

    public String joinMeeting(Long consultationId, String requesterPhoneNumber) {
        log.info("User/Lawyer {} is attempting to join consultation {} meeting", requesterPhoneNumber, consultationId);
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found with id: " + consultationId));

        if (consultation.getStatus() != ConsultationStatus.BOOKED) {
            throw new IllegalStateException("Consultation is not in BOOKED status. Current status: " + consultation.getStatus());
        }

        Lawyer lawyer = lawyerRepository.findById(consultation.getLawyerId())
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found with id: " + consultation.getLawyerId()));

        // Ownership Validation: User who booked OR the assigned Lawyer
        if (!consultation.getUserPhoneNumber().equals(requesterPhoneNumber) && 
            !lawyer.getPhoneNumber().equals(requesterPhoneNumber)) {
            log.warn("Unauthorized join attempt for consultation {} by {}", consultationId, requesterPhoneNumber);
            throw new ResourceNotFoundException("Consultation not found for the current requester.");
        }

        log.info("Access granted to meeting for consultation {} to {}", consultationId, requesterPhoneNumber);
        return consultation.getMeetingLink();
    }

    private ConsultationResponse mapToResponse(Consultation consultation, String lawyerName, LocalDateTime consultationTime) {
        return ConsultationResponse.builder()
                .id(consultation.getId())
                .lawyerId(consultation.getLawyerId())
                .slotId(consultation.getSlotId())
                .lawyerName(lawyerName)
                .consultationTime(consultationTime)
                .status(consultation.getStatus())
                .createdAt(consultation.getCreatedAt())
                .meetingLink(consultation.getMeetingLink())
                .build();
    }
}
