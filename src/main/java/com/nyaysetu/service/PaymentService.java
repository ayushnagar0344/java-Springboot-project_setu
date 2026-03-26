package com.nyaysetu.service;

import com.nyaysetu.dto.PaymentResponse;
import com.nyaysetu.entity.Consultation;
import com.nyaysetu.entity.ConsultationStatus;
import com.nyaysetu.entity.Payment;
import com.nyaysetu.entity.PaymentStatus;
import com.nyaysetu.exception.ResourceNotFoundException;
import com.nyaysetu.repository.ConsultationRepository;
import com.nyaysetu.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ConsultationRepository consultationRepository;
    private final JitsiService jitsiService;

    public PaymentResponse createPayment(Long consultationId, Double amount) {
        if (!consultationRepository.existsById(consultationId)) {
            throw new ResourceNotFoundException("Consultation not found with id: " + consultationId);
        }

        if (paymentRepository.existsByConsultationId(consultationId)) {
            throw new IllegalArgumentException("Payment already exists or is pending for this consultation.");
        }

        // Generate structured payment ID: NYAY-{DATE}-{RANDOM}
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%04d", new Random().nextInt(10000));
        String structuredPaymentId = "NYAY-" + datePart + "-" + randomPart;

        Payment payment = Payment.builder()
                .consultationId(consultationId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .paymentId(structuredPaymentId)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment created for consultation: {}. PaymentID: {}", consultationId, structuredPaymentId);
        return mapToResponse(savedPayment);
    }

    public PaymentResponse markPaymentSuccess(String paymentId, String userPhoneNumber) {
        log.info("Attempting to mark payment {} as SUCCESS for user: {}", paymentId, userPhoneNumber);
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with paymentId: " + paymentId));

        Consultation consultation = consultationRepository.findById(payment.getConsultationId())
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found for payment: " + paymentId));

        // Ownership Validation
        if (!consultation.getUserPhoneNumber().equals(userPhoneNumber)) {
            log.warn("Payment success attempt for unauthorized user: {}. PaymentId: {}", userPhoneNumber, paymentId);
            throw new ResourceNotFoundException("Consultation not found for the current user.");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalArgumentException("Payment is already marked as SUCCESS.");
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        // Update Consultation status and generate secure meeting link
        consultation.setStatus(ConsultationStatus.BOOKED);
        consultation.setMeetingLink(jitsiService.generateMeetingLink(consultation.getId()));
        consultationRepository.save(consultation);

        log.info("Payment {} marked as SUCCESS. Consultation {} is now BOOKED.", paymentId, consultation.getId());
        return mapToResponse(savedPayment);
    }

    public PaymentResponse markPaymentFailed(String paymentId, String userPhoneNumber) {
        log.info("Attempting to mark payment {} as FAILED for user: {}", paymentId, userPhoneNumber);
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with paymentId: " + paymentId));

        Consultation consultation = consultationRepository.findById(payment.getConsultationId())
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found for payment: " + paymentId));

        // Ownership Validation
        if (!consultation.getUserPhoneNumber().equals(userPhoneNumber)) {
            log.warn("Payment fail attempt for unauthorized user: {}. PaymentId: {}", userPhoneNumber, paymentId);
            throw new ResourceNotFoundException("Consultation not found for the current user.");
        }

        payment.setStatus(PaymentStatus.FAILED);
        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment {} marked as FAILED.", paymentId);
        return mapToResponse(savedPayment);
    }
    
    public PaymentResponse getPaymentByConsultationId(Long consultationId, String userPhoneNumber) {
        log.info("User {} retrieving payment for consultation {}", userPhoneNumber, consultationId);
        
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found with id: " + consultationId));

        if (!consultation.getUserPhoneNumber().equals(userPhoneNumber)) {
            log.warn("Unauthorized payment retrieval attempt for consultation {} by user {}", consultationId, userPhoneNumber);
            throw new ResourceNotFoundException("Consultation not found for the current user.");
        }

        Payment payment = paymentRepository.findByConsultationId(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for consultation: " + consultationId));
        return mapToResponse(payment);
    }

    public List<PaymentResponse> getMyPayments(String userPhoneNumber) {
        log.info("User {} retrieving their payment history", userPhoneNumber);
        List<Consultation> consultations = consultationRepository.findByUserPhoneNumber(userPhoneNumber);
        List<Long> consultationIds = consultations.stream().map(Consultation::getId).collect(Collectors.toList());

        if (consultationIds.isEmpty()) return List.of();

        return paymentRepository.findByConsultationIdIn(consultationIds).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .consultationId(payment.getConsultationId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentId(payment.getPaymentId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
