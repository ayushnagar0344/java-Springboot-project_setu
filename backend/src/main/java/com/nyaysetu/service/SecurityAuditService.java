package com.nyaysetu.service;

import com.nyaysetu.entity.AuditEntry;
import com.nyaysetu.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityAuditService {

    private final AuditRepository auditRepository;

    public void logAction(String action, String performedBy, String details) {
        logAction(action, performedBy, details, "SYSTEM");
    }

    public void logAction(String action, String performedBy, String details, String ip) {
        AuditEntry entry = AuditEntry.builder()
                .action(action)
                .performedBy(performedBy)
                .details(details)
                .ipAddress(ip)
                .build();
        
        auditRepository.save(entry);
        log.info("[AUDIT] Action: {}, PerformedBy: {}, Details: {}", action, performedBy, details);
    }
}
