package com.nyaysetu.repository;

import com.nyaysetu.entity.LegalCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegalCaseRepository extends JpaRepository<LegalCase, Long> {
    List<LegalCase> findByUserPhoneNumber(String userPhoneNumber);
    List<LegalCase> findByLawyerId(Long lawyerId);
    Optional<LegalCase> findByCaseNumber(String caseNumber);
}
