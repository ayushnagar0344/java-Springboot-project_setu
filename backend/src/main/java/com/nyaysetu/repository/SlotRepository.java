package com.nyaysetu.repository;

import com.nyaysetu.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByLawyerIdAndIsBookedFalse(Long lawyerId);

    boolean existsByLawyerIdAndStartTime(Long lawyerId, LocalDateTime startTime);

    List<Slot> findByLawyerIdAndStartTimeBetweenOrderByStartTimeAsc(Long lawyerId, LocalDateTime start, LocalDateTime end);
}
