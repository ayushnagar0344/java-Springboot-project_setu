package com.nyaysetu.repository;

import com.nyaysetu.entity.Lawyer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LawyerRepository extends JpaRepository<Lawyer, Long> {

    Optional<Lawyer> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT l FROM Lawyer l WHERE " +
           "(:specialization IS NULL OR LOWER(l.specialization) = LOWER(:specialization)) AND " +
           "(:city IS NULL OR LOWER(l.city) = LOWER(:city)) AND " +
           "(:isOnline IS NULL OR l.isOnline = :isOnline)")
    List<Lawyer> searchLawyers(@Param("specialization") String specialization,
                               @Param("city") String city,
                               @Param("isOnline") Boolean isOnline);
}
