package com.nyaysetu.service;

import com.nyaysetu.dto.SlotDto;
import com.nyaysetu.entity.Slot;
import com.nyaysetu.exception.DuplicateSlotException;
import com.nyaysetu.exception.ResourceNotFoundException;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlotService {

    private final SlotRepository slotRepository;
    private final LawyerRepository lawyerRepository;

    private static final int MAX_SLOTS_PER_DAY = 20;

    public List<SlotDto> createSlots(Long lawyerId, List<LocalDateTime> startTimes, String requesterPhoneNumber) {
        // Enforce 20 slots/day limit
        if (!startTimes.isEmpty()) {
            LocalDate date = startTimes.get(0).toLocalDate();
            long existingCount = slotRepository.findByLawyerIdAndStartTimeBetweenOrderByStartTimeAsc(
                    lawyerId, date.atStartOfDay(), date.atTime(23, 59, 59)).size();
            if (existingCount + startTimes.size() > MAX_SLOTS_PER_DAY) {
                log.warn("Exceeding {} slots per day. Limiting the requested slots.", MAX_SLOTS_PER_DAY);
                if (existingCount >= MAX_SLOTS_PER_DAY) {
                    return List.of();
                } else {
                    startTimes = startTimes.subList(0, MAX_SLOTS_PER_DAY - (int)existingCount);
                }
            }
        }

        // Phase 1 Fallback: Allow USER to create if no lawyers exist
        if (lawyerRepository.count() > 0) {
            // If lawyers exist, ensure the lawyerId actually exists
            com.nyaysetu.entity.Lawyer lawyer = lawyerRepository.findById(lawyerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found with id: " + lawyerId));
            
            // SECURITY CHECK: Ensure lawyer is creating slots for THEMSELVES
            // (Unless it's an ADMIN or a SYSTEM startup call with no auth context)
            var auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth != null && auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isSystemCall = (auth == null || "SYSTEM".equals(requesterPhoneNumber));
                    
            if (!isAdmin && !isSystemCall && !lawyer.getPhoneNumber().equals(requesterPhoneNumber)) {
                log.warn("Unauthorized slot creation attempt for lawyer {} by user {}", lawyerId, requesterPhoneNumber);
                throw new com.nyaysetu.exception.UnauthorizedAccessException("You cannot create slots for another lawyer.");
            }
        }

        LocalDateTime now = LocalDateTime.now();

        List<Slot> newSlots = startTimes.stream()
                .filter(startTime -> {
                    if (startTime.isBefore(now)) {
                        log.warn("Skipping slot creation for past time: {} for lawyer: {}", startTime, lawyerId);
                        return false;
                    }
                    if (slotRepository.existsByLawyerIdAndStartTime(lawyerId, startTime)) {
                        log.warn("Skipping duplicate slot for lawyer: {} at {}", lawyerId, startTime);
                        return false;
                    }
                    return true;
                })
                .map(startTime -> Slot.builder()
                        .lawyerId(lawyerId)
                        .startTime(startTime)
                        .endTime(startTime.plusMinutes(30))
                        .isBooked(false)
                        .build())
                .collect(Collectors.toList());

        if (newSlots.isEmpty()) {
            log.info("No new slots to create for lawyer: {}", lawyerId);
            return List.of();
        }

        List<Slot> savedSlots = slotRepository.saveAll(newSlots);
        log.info("Created {} new slots for lawyer: {}", savedSlots.size(), lawyerId);

        return savedSlots.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SlotDto> getSlotsByLawyerAndDate(Long lawyerId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        return slotRepository.findByLawyerIdAndStartTimeBetweenOrderByStartTimeAsc(lawyerId, startOfDay, endOfDay)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SlotDto> getAvailableSlots(Long lawyerId) {
        return slotRepository.findByLawyerIdAndIsBookedFalse(lawyerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SlotDto bookSlot(Long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        if (slot.isBooked()) {
            throw new DuplicateSlotException("Slot is already booked.");
        }

        slot.setBooked(true);
        Slot savedSlot = slotRepository.save(slot);

        return mapToDto(savedSlot);
    }

    @Transactional
    public void cleanupDuplicateSlots() {
        log.info("Starting duplicate slot cleanup...");
        List<Slot> allSlots = slotRepository.findAll();
        
        // Group by lawyerId and startTime to find duplicates
        java.util.Map<String, List<Slot>> grouped = allSlots.stream()
                .collect(java.util.stream.Collectors.groupingBy(s -> s.getLawyerId() + ":" + s.getStartTime()));

        for (java.util.Map.Entry<String, List<Slot>> entry : grouped.entrySet()) {
            List<Slot> duplicates = entry.getValue();
            if (duplicates.size() > 1) {
                // Keep the first one, delete the rest
                for (int i = 1; i < duplicates.size(); i++) {
                    log.warn("Deleting duplicate slot: id={} lawyerId={} startTime={}", 
                            duplicates.get(i).getId(), duplicates.get(i).getLawyerId(), duplicates.get(i).getStartTime());
                    slotRepository.delete(duplicates.get(i));
                }
            }
        }
        log.info("Duplicate slot cleanup completed.");
    }

    private SlotDto mapToDto(Slot slot) {
        return SlotDto.builder()
                .id(slot.getId())
                .lawyerId(slot.getLawyerId())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .isBooked(slot.isBooked())
                .build();
    }
}
