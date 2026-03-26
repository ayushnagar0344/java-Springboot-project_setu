package com.nyaysetu.config;

import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.entity.Role;
import com.nyaysetu.entity.User;
import com.nyaysetu.repository.LawyerRepository;
import com.nyaysetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking for default Admin user...");
        if (!userRepository.existsByPhoneNumber("9999999999")) {
            User admin = User.builder()
                    .name("System Admin")
                    .phoneNumber("9999999999")
                    .email("admin@nyaysetu.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: 9999999999 / admin123");
        } else {
            User admin = userRepository.findByPhoneNumber("9999999999").get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("Admin user 9999999999 password reset to admin123 and role verified as ADMIN.");
        }

        log.info("Checking for sample Lawyer data...");
        initializeLawyerIfNotExists("Adv. Rajesh Sharma", "Criminal Law", "8888888888", "New Delhi", 15, true, 4.8);
        initializeLawyerIfNotExists("Adv. Priya Singh", "Family & Divorce", "7777777777", "Mumbai", 10, true, 4.9);
        initializeLawyerIfNotExists("Adv. Amit Verma", "Corporate Law", "6666666666", "Bangalore", 8, false, 4.5);
        log.info("Sample data check completed.");
    }

    private void initializeLawyerIfNotExists(String name, String spec, String phone, String city, int exp, boolean online, double rating) {
        if (!lawyerRepository.existsByPhoneNumber(phone)) {
            Lawyer lawyer = Lawyer.builder()
                    .name(name)
                    .specialization(spec)
                    .phoneNumber(phone)
                    .city(city)
                    .experienceYears(exp)
                    .isOnline(online)
                    .rating(rating)
                    .build();
            lawyerRepository.save(lawyer);
            createLawyerUser(lawyer);
            log.info("Created lawyer and user for phone: {}", phone);
        } else {
            // Even if lawyer exists, make sure the User account exists
            createLawyerUser(lawyerRepository.findByPhoneNumber(phone).get());
        }
    }

    private void createLawyerUser(Lawyer lawyer) {
        if (!userRepository.existsByPhoneNumber(lawyer.getPhoneNumber())) {
            User user = User.builder()
                    .name(lawyer.getName())
                    .phoneNumber(lawyer.getPhoneNumber())
                    .password(passwordEncoder.encode("lawyer123"))
                    .role(Role.LAWYER)
                    .build();
            userRepository.save(user);
        }
    }
}
