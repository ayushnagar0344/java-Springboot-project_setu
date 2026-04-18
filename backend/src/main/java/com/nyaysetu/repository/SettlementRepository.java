package com.nyaysetu.repository;

import com.nyaysetu.entity.Settlement;
import com.nyaysetu.entity.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByRaisedByPhoneOrderByCreatedAtDesc(String phone);
    List<Settlement> findByAssignedLawyerIdOrderByCreatedAtDesc(Long lawyerId);
    List<Settlement> findByStatusOrderByCreatedAtDesc(SettlementStatus status);
    List<Settlement> findAllByOrderByCreatedAtDesc();
}
