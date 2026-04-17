package com.nyaysetu.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "case_hearings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseHearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private LegalCase legalCase;

    @Column(nullable = false)
    private LocalDateTime hearingDate;

    @Column(nullable = false)
    private String location;

    private String details;
}
