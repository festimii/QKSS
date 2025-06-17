package com.qkss.map.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;
import java.time.Instant;

/**
 * DTO used to receive a “create pin” request from the front end.
 *
 * JSON shape expected:
 * {
 *   "title": {
 *     "en": "Germia Park",
 *     "sq": "Parku i Gërmisë",
 *     "sr": "Парк Грмља"
 *   },
 *   "description": {
 *     "en": "A large park in Kosovo",
 *     "sq": "Park i madh në Kosovë",
 *     "sr": "Велики парк на Косову"
 *   },
 *   "city": "Pristina",
 *   "lat": 42.6723,
 *   "lng": 21.1906,
 *   "articleUrl": "https://en.wikipedia.org/wiki/Germia_Park",
 *   "timestamp": "2025-06-01T12:00:00Z"
 * }
 */
@Data
public class CreatePinDTO {
    @NotNull
    private Map<String, String> title;

    @NotNull
    private Map<String, String> description;

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;

    // City is optional; if omitted the JSON can exclude it or set it to null
    private String city;

    @NotNull
    private String articleUrl;

    // ISO-8601 timestamp of when the event occurred
    @NotNull
    private Instant timestamp;
}
