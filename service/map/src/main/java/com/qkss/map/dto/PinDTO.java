package com.qkss.map.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;
import java.time.Instant;

/**
 * DTO returned to clients when listing or creating pins.
 *
 * Example JSON returned:
 * [
 *   {
 *     "id": "6841b97c0dec2c55be49eb25",
 *     "title": {
 *       "en": "Germia Park",
 *       "sq": "Parku i Gërmisë",
 *       "sr": "Парк Грмља"
 *     },
 *     "lat": 42.6723,
 *     "lng": 21.1906,
 *     "articleUrl": "https://en.wikipedia.org/wiki/Germia_Park"
 *     "timestamp": "2025-06-01T12:00:00Z"
 *   },
 *   ...
 * ]
 */
@Data
@AllArgsConstructor
public class PinDTO {
    private String id;

    private Map<String, String> title;

    private Map<String, String> description;

    private double lat;
    private double lng;

    private String city;

    private String articleUrl;

    private Instant timestamp;
}
