package com.nyaysetu.config;

import com.nyaysetu.entity.*;
import com.nyaysetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final LegalCaseRepository caseRepository;
    private final CaseHearingRepository hearingRepository;
    private final LawyerApplicationRepository applicationRepository;
    private final SlotRepository slotRepository;
    private final ConsultationRepository consultationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if the database is empty (prevents wiping new users on server restart)
        if (userRepository.count() > 0) {
            log.info("--- DATA SEEDING SKIPPED (database already has {} users) ---", userRepository.count());
            return;
        }

        log.info("--- PRODUCTION DATA SEEDING STARTED (fresh database) ---");

        // 2. Seed Admin "ayush"
        createAdmin("ayush", "1111111111", "111");

        // 3. Seed 10 Active Lawyers
        List<Lawyer> activeLawyers = new ArrayList<>();
        String[] lawyerPrefixes = {"Adv. Sharma", "Adv. Gupta", "Adv. Khan", "Adv. Reddy", "Adv. Das", 
                                   "Adv. Iyer", "Adv. Singh", "Adv. Mehta", "Adv. Patil", "Adv. Bose"};
        String[] specializations = {"Criminal Law", "Corporate Law", "Family Law", "Civil Litigation", "Constitutional Law"};
        String[] passes = {"111", "222", "33"};
        
        for (int i = 0; i < 10; i++) {
            String phone = "880000000" + i;
            String pass = passes[i % 3];
            Lawyer l = createLawyer(lawyerPrefixes[i], specializations[i % 5], phone, "Metro City", 5 + i, pass);
            activeLawyers.add(l);
        }

        // 4. Seed 5 Users
        List<User> users = new ArrayList<>();
        String[] userNames = {"Vikram", "Sita", "Rohit", "Ananya", "Rahul (Empty)"};
        String[] userPasses = {"222", "33"};
        
        for (int i = 0; i < 5; i++) {
            User u = createUser(userNames[i], "990000000" + i, userPasses[i % 2], Role.USER);
            users.add(u);
            
            // Create cases for the first 4 users
            if (i < 4) {
                createCaseForUser(u, activeLawyers.get(i), i);
            }
        }

        // 5. Seed 4 Pending Onboarding Lawyers
        for (int i = 0; i < 4; i++) {
            createPendingApplication("Applicant " + (i+1), "870000000" + i);
        }

        // 6. Seed Slots and Consultations for Upcoming Week
        seedWeeklySchedule(activeLawyers, users);

        log.info("--- PRODUCTION DATA SEEDING COMPLETED ---");
        log.info("Admin 'ayush' active at 1111111111 / 111");
    }

    private void createAdmin(String name, String phone, String pass) {
        User admin = User.builder()
                .name(name)
                .phoneNumber(phone)
                .password(passwordEncoder.encode(pass))
                .role(Role.ADMIN)
                .email(name + "@nyaysetu.com")
                .build();
        userRepository.save(admin);
        log.info("Admin Created: {} / {}", phone, pass);
    }

    private Lawyer createLawyer(String name, String spec, String phone, String city, int exp, String pass) {
        Lawyer lawyer = Lawyer.builder()
                .name(name)
                .specialization(spec)
                .phoneNumber(phone)
                .city(city)
                .experienceYears(exp)
                .rating(Math.round((4.5 + (new Random().nextDouble() * 0.5)) * 10.0) / 10.0)
                .isOnline(true)
                .build();
        lawyerRepository.save(lawyer);
        
        User user = User.builder()
                .name(name)
                .phoneNumber(phone)
                .password(passwordEncoder.encode(pass))
                .role(Role.LAWYER)
                .build();
        userRepository.save(user);
        return lawyer;
    }

    private User createUser(String name, String phone, String pass, Role role) {
        User user = User.builder()
                .name(name)
                .phoneNumber(phone)
                .password(passwordEncoder.encode(pass))
                .role(role)
                .build();
        return userRepository.save(user);
    }

    private void createCaseForUser(User user, Lawyer lawyer, int index) {
        CaseStatus[] statuses = {CaseStatus.INITIATED, CaseStatus.INVESTIGATION, CaseStatus.HEARING, CaseStatus.FINAL_JUDGEMENT};
        LegalCase legalCase = LegalCase.builder()
                .caseNumber("NY-CASE-2026-" + (100 + index))
                .title("Legal Matter of " + user.getName())
                .description("Professional litigation tracking for " + user.getName())
                .userPhoneNumber(user.getPhoneNumber())
                .lawyerId(lawyer.getId())
                .status(statuses[index % 4])
                .currentLocation("Court Complex - Floor " + (index + 1))
                .build();
        caseRepository.save(legalCase);

        CaseHearing hearing = CaseHearing.builder()
                .legalCase(legalCase)
                .hearingDate(LocalDateTime.now().plusDays(2 + index))
                .location("Judicial Room " + (200 + index))
                .details("Preliminary documentation and evidence verification.")
                .build();
        hearingRepository.save(hearing);
    }

    private void createPendingApplication(String name, String phone) {
        LawyerApplication app = LawyerApplication.builder()
                .name(name)
                .phoneNumber(phone)
                .email(name.replace(" ", ".") + "@verify.com")
                .specialization("General Practice")
                .city("Verification Center")
                .experienceYears(3)
                .barCouncilId("BCI/DUMMY/" + phone.substring(6))
                .status(ApplicationStatus.PENDING)
                .build();
        applicationRepository.save(app);
    }

    private void seedWeeklySchedule(List<Lawyer> lawyers, List<User> users) {
        LocalDateTime start = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0);
        
        for (int d = 0; d < 7; d++) {
            LocalDateTime day = start.plusDays(d);
            for (int h = 0; h < 3; h++) {
                LocalDateTime slotTime = day.plusHours(h);
                for (Lawyer lawyer : lawyers) {
                    Slot slot = Slot.builder()
                            .lawyerId(lawyer.getId())
                            .startTime(slotTime)
                            .endTime(slotTime.plusMinutes(45))
                            .isBooked(false)
                            .build();
                    
                    // Randomly book some slots for the 5 users
                    if (new Random().nextInt(10) > 7) {
                        slot.setBooked(true);
                        slotRepository.save(slot);
                        
                        Consultation cons = Consultation.builder()
                                .userPhoneNumber(users.get(new Random().nextInt(users.size())).getPhoneNumber())
                                .lawyerId(lawyer.getId())
                                .slotId(slot.getId())
                                .status(ConsultationStatus.BOOKED)
                                .meetingLink("https://jitsi.nyaysetu.com/room-" + slot.getId())
                                .build();
                        consultationRepository.save(cons);
                    } else {
                        slotRepository.save(slot);
                    }
                }
            }
        }
    }
}
