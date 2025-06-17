package com.qkss.map.service;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;
import com.qkss.map.exception.PinNotFoundException;
import com.qkss.map.model.Pin;
import com.qkss.map.repository.PinRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;
import java.util.Optional;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PinServiceImplTest {

    @Mock
    private PinRepository repo;
    @Mock
    private MongoTemplate mongoTemplate;

    private PinServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new PinServiceImpl(repo, mongoTemplate);
    }

    @Test
    void getPin_returnsDto_whenFound() {
        Pin pin = Pin.builder()
                .id("1")
                .title(Map.of("en", "t"))
                .description(Map.of("en", "d"))
                .category("Violent Incidents")
                .lat(1.0)
                .lng(2.0)
                .city("c")
                .articleUrl("u")
                .timestamp(Instant.parse("2025-06-01T12:00:00Z"))
                .build();
        when(repo.findById("1")).thenReturn(Optional.of(pin));

        PinDTO dto = service.getPin("1");

        assertEquals("1", dto.getId());
        assertEquals(1.0, dto.getLat());
        assertEquals(2.0, dto.getLng());
        assertEquals("u", dto.getArticleUrl());
        assertEquals("c", dto.getCity());
        assertEquals("Violent Incidents", dto.getCategory());
        assertEquals(Map.of("en", "d"), dto.getDescription());
        assertEquals(Instant.parse("2025-06-01T12:00:00Z"), dto.getTimestamp());
        verify(repo).findById("1");
    }

    @Test
    void getPin_throws_whenMissing() {
        when(repo.findById("x")).thenReturn(Optional.empty());
        assertThrows(PinNotFoundException.class, () -> service.getPin("x"));
    }
}
