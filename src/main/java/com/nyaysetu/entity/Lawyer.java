package com.nyaysetu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lawyers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lawyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private int experienceYears;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private boolean isOnline;

    @Column(nullable = false)
    private double rating;
}
