package com.nyaysetu.entity;

import com.nyaysetu.util.CryptoConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lawyer_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LawyerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    @Min(0)
    private Integer experienceYears;

    @Convert(converter = CryptoConverter.class)
    @Column(nullable = false)
    private String barCouncilId; // Encrypted in DB

    @Column(length = 1000)
    private String shortBio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime appliedAt;
}
