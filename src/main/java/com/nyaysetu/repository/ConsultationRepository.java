package com.nyaysetu.repository;

import com.nyaysetu.entity.Consultation;
import com.nyaysetu.entity.ConsultationStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    boolean existsBySlotId(Long slotId);

    List<Consultation> findByUserPhoneNumber(String userPhoneNumber);

    long countByUserPhoneNumber(String userPhoneNumber);

    long countByUserPhoneNumberAndStatus(String userPhoneNumber, ConsultationStatus status);

    List<Consultation> findByUserPhoneNumberOrderByCreatedAtDesc(String userPhoneNumber, Pageable pageable);

    long countByLawyerId(Long lawyerId);

    long countByLawyerIdAndStatus(Long lawyerId, ConsultationStatus status);

    List<Consultation> findByLawyerId(Long lawyerId);

    List<Consultation> findByLawyerIdOrderByCreatedAtDesc(Long lawyerId, Pageable pageable);
}
