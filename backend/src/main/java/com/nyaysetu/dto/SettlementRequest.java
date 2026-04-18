package com.nyaysetu.dto;

import lombok.Data;

@Data
public class SettlementRequest {
    private String title;
    private String description;
    private String oppositionName;
    private String oppositionContact;
}
