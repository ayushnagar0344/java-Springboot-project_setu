package com.nyaysetu.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LegalApiService {

    private final RestTemplate restTemplate;
    private static final String FEDERAL_REGISTER_API = "https://www.federalregister.gov/api/v1/documents.json?term=%s&per_page=3";

    @Data
    public static class FederalRegisterResponse {
        private int count;
        private String description;
        private List<Document> results;
    }

    @Data
    public static class Document {
        private String title;
        private String abstractText;
        private String htmlUrl;
        private String publicationDate;
    }

    public String searchLegalRules(String query) {
        try {
            String url = String.format(FEDERAL_REGISTER_API, query);
            FederalRegisterResponse response = restTemplate.getForObject(url, FederalRegisterResponse.class);

            if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
                return null;
            }

            return response.getResults().stream()
                    .map(doc -> String.format("Title: %s\nSummary: %s\nRef: %s", 
                        doc.getTitle(), 
                        doc.getAbstractText() != null ? doc.getAbstractText() : "N/A", 
                        doc.getHtmlUrl()))
                    .collect(Collectors.joining("\n\n"));
        } catch (Exception e) {
            log.error("Failed to fetch legal rules from Federal Register", e);
            return null;
        }
    }
}
