package com.nyaysetu.scheduler;

import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.service.SlotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlotGeneratorScheduler {

    private final SlotService slotService;
    private final LawyerRepository lawyerRepository;

    // Run every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    public void generateSlotsForNext3Days() {
        log.info("Starting automated slot generation for next 3 days...");
        List<Lawyer> lawyers = lawyerRepository.findAll();
        
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 3; i++) {
            LocalDate targetDate = today.plusDays(i);
            for (Lawyer lawyer : lawyers) {
                generateSlotsForLawyerAndDate(lawyer.getId(), targetDate);
            }
        }
        log.info("Automated slot generation completed.");
    }

    private void generateSlotsForLawyerAndDate(Long lawyerId, LocalDate date) {
        // Generate slots from 10:00 AM to 6:00 PM (example)
        // With max 20 slots per day limit as requested
        List<LocalDateTime> startTimes = new ArrayList<>();
        LocalTime time = LocalTime.of(10, 0);
        int count = 0;
        
        while (time.isBefore(LocalTime.of(18, 0)) && count < 20) {
            startTimes.add(LocalDateTime.of(date, time));
            time = time.plusMinutes(30);
            count++;
        }
        
        slotService.createSlots(lawyerId, startTimes, "SYSTEM");
    }
    
    // Initializer to run once on startup if needed (or just use @PostConstruct)
    public void runInitialGeneration() {
        generateSlotsForNext3Days();
    }
}
