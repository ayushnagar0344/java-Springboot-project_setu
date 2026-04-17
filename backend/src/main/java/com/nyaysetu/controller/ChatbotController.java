package com.nyaysetu.controller;

import com.nyaysetu.dto.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final com.nyaysetu.service.LegalApiService legalApiService;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatMessage {
        private String message;
        private String sender;
        private LocalDateTime timestamp;
    }

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessage>> handleMessage(@RequestBody ChatMessage userMessage) {
        String content = userMessage.getMessage().toLowerCase();
        String response;

        // Try searching for real legal rules first for specific queries
        if (content.length() > 10 && !content.contains("hello") && !content.contains("hi")) {
            String legalContext = legalApiService.searchLegalRules(userMessage.getMessage());
            if (legalContext != null) {
                response = "According to legal records:\n\n" + legalContext + 
                           "\n\nDISCLAIMER: This is for informational purposes only. Consult a registered lawyer below for professional advice.";
                ChatMessage botResponse = new ChatMessage(response, "JusticeBot", LocalDateTime.now());
                return ResponseEntity.ok(ApiResponse.success("Legal data found", botResponse));
            }
        }

        if (content.contains("book") || content.contains("appointment") || content.contains("consultation")) {
            response = "To book a consultation, go to the 'Find Lawyers' page, select a lawyer, and choose an available slot. You'll then be prompted to make a payment.";
        } else if (content.contains("payment") || content.contains("pay") || content.contains("money")) {
            response = "We support secure payments via mock gateway. Once you select a slot, you'll be redirected to the payment page to confirm your booking.";
        } else if (content.contains("lawyer") || content.contains("advocate")) {
            response = "Our marketplace features top-rated legal experts across various specializations like Criminal Law, Corporate Law, and Family Law.";
        } else if (content.contains("hello") || content.contains("hi") || content.contains("hey")) {
            response = "Greetings! I am JusticeBot. How can I assist you with your legal consultation needs today?";
        } else if (content.contains("help")) {
            response = "I can help you with: \n1. Finding and booking lawyers\n2. Navigating your dashboard\n3. Understanding the payment process\nWhat do you need help with?";
        } else if (content.contains("status") || content.contains("system")) {
            response = "All systems are operational. The NyaySetu platform is running at peak performance.";
        } else {
            response = "That's an interesting question. While I'm still learning, I recommend checking our 'Find Lawyers' page or contacting support for specific legal advice.";
        }

        ChatMessage botResponse = new ChatMessage(response, "JusticeBot", LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success("Message processed", botResponse));
    }
}
