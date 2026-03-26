package com.nyaysetu.repository;

import com.nyaysetu.entity.Payment;
import java.util.List;
import com.nyaysetu.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    boolean existsByConsultationId(Long consultationId);
    
    Optional<Payment> findByConsultationId(Long consultationId);
    
    Optional<Payment> findByPaymentId(String paymentId);

    List<Payment> findByConsultationIdIn(List<Long> consultationIds);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.consultationId IN :ids")
    Double sumAmountByStatusAndConsultationIds(@Param("status") PaymentStatus status, @Param("ids") List<Long> ids);
}
