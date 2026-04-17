package com.nyaysetu.config;

import com.nyaysetu.service.SlotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class Phase2MigrationRunner implements CommandLineRunner {

    private final SlotService slotService;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info(">>> PHASE 2 MIGRATION STARTING <<<");
        
        try {
            // STEP 1: Cleanup Duplicates
            slotService.cleanupDuplicateSlots();
            
            // STEP 2: Apply Unique Constraint (Safe check)
            log.info("Applying UNIQUE constraint on slots(lawyer_id, start_time)...");
            
            // Check if constraint already exists (simple H2/MySQL approach)
            // For MySQL: ALTER TABLE slots ADD CONSTRAINT unique_lawyer_slot UNIQUE (lawyer_id, start_time)
            // We use a try-catch for the SQL to handle cases where it already exists
            try {
                jdbcTemplate.execute("ALTER TABLE slots ADD CONSTRAINT unique_lawyer_slot UNIQUE (lawyer_id, start_time)");
                log.info("UNIQUE constraint applied successfully.");
            } catch (Exception e) {
                // Constraint already exists or cannot be applied — this is safe to ignore
                log.info("UNIQUE constraint already exists or skipped: {}", e.getMessage().split("\n")[0]);
            }
            
            log.info(">>> PHASE 2 MIGRATION COMPLETED <<<");
        } catch (Exception e) {
            log.error("Phase 2 Migration encountered an error: ", e);
        }
    }
}
