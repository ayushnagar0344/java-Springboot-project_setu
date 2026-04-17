package com.nyaysetu.service;

import com.nyaysetu.entity.Lawyer;
import com.nyaysetu.repository.LawyerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LawyerService {

    private final LawyerRepository lawyerRepository;

    public List<Lawyer> getAllLawyers() {
        return lawyerRepository.findAll();
    }

    public List<Lawyer> searchLawyers(String specialization, String city, Boolean isOnline) {
        return lawyerRepository.searchLawyers(specialization, city, isOnline);
    }
}
