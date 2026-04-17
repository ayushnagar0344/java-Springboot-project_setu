package com.nyaysetu.repository;

import com.nyaysetu.entity.CaseHearing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseHearingRepository extends JpaRepository<CaseHearing, Long> {
    List<CaseHearing> findByLegalCaseId(Long caseId);
}
