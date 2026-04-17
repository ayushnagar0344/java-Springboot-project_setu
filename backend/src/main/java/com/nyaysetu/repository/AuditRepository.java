package com.nyaysetu.repository;

import com.nyaysetu.entity.AuditEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditEntry, Long> {
    List<AuditEntry> findByPerformedByOrderByTimestampDesc(String performedBy);
}
