package com.nyaysetu.service;

import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
public class JitsiService {

    public String generateMeetingLink(Long consultationId) {
        long timestamp = Instant.now().getEpochSecond();
        return "https://meet.jit.si/nyaysetu-" + consultationId + "-" + timestamp;
    }
}
