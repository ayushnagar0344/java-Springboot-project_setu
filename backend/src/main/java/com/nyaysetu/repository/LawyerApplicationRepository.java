package com.nyaysetu.repository;

import com.nyaysetu.entity.LawyerApplication;
import com.nyaysetu.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LawyerApplicationRepository extends JpaRepository<LawyerApplication, Long> {
    List<LawyerApplication> findByStatus(ApplicationStatus status);
}
