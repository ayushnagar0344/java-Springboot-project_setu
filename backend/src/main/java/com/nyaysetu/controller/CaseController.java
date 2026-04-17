package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import com.nyaysetu.entity.CaseHearing;
import com.nyaysetu.entity.LegalCase;
import com.nyaysetu.repository.CaseHearingRepository;
import com.nyaysetu.repository.LegalCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final LegalCaseRepository caseRepository;
    private final CaseHearingRepository hearingRepository;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LegalCase>>> getAllCases() {
        return ResponseEntity.ok(ApiResponse.success("All cases retrieved", caseRepository.findAll()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'LAWYER')")
    public ResponseEntity<ApiResponse<List<LegalCase>>> getMyCases(Principal principal) {
        String phone = principal.getName();
        // Check if user is lawyer or client
        List<LegalCase> cases = caseRepository.findByUserPhoneNumber(phone);
        if (cases.isEmpty()) {
            // Check if it's a lawyer looking for their cases
            // (Note: This assumes we find the lawyer ID associated with the phone)
            // For now, simplicity: client-centric lookup
        }
        return ResponseEntity.ok(ApiResponse.success("User cases retrieved", cases));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LegalCase>> createCase(@RequestBody LegalCase legalCase) {
        LegalCase saved = caseRepository.save(legalCase);
        return ResponseEntity.ok(ApiResponse.success("Case initiated successfully", saved));
    }

    @PostMapping("/{caseId}/hearings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CaseHearing>> addHearing(@PathVariable Long caseId, @RequestBody CaseHearing hearing) {
        return caseRepository.findById(caseId).map(legalCase -> {
            hearing.setLegalCase(legalCase);
            CaseHearing saved = hearingRepository.save(hearing);
            return ResponseEntity.ok(ApiResponse.success("Hearing scheduled", saved));
        }).orElse(ResponseEntity.notFound().build());
    }
}
