package com.qkss.map.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;
import java.time.Instant;

/**
 * The Pin entity (e.g., stored in a MongoDB “pins” collection).
 * Fields match exactly what CreatePinDTO provides.
 */
@Document(collection = "pins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pin {
    @Id
    private String id;

    // Multi‐language title (en, sq, sr, etc.)
    private Map<String, String> title;

    // Multi‐language description
    private Map<String, String> description;

    private Double lat;
    private Double lng;

    // Optional city field
    private String city;

    private String articleUrl;

    private Instant timestamp;
}
