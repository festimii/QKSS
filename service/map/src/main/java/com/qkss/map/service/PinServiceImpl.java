package com.qkss.map.service;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;
import com.qkss.map.exception.PinNotFoundException;
import com.qkss.map.model.Pin;
import com.qkss.map.repository.PinRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PinServiceImpl implements PinService {
    private final PinRepository pinRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public List<PinDTO> listPins() {
        return pinRepository.findAll()
                .stream()
                .map(pin -> new PinDTO(
                        pin.getId(),
                        pin.getTitle(),
                        pin.getDescription(),
                        pin.getCategory(),
                        pin.getLat(),
                        pin.getLng(),
                        pin.getCity(),
                        pin.getArticleUrl(),
                        pin.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<PinDTO> listPinsFiltered(List<String> categories, Instant start, Instant end) {
        Query query = new Query();

        if (start != null && end != null) {
            query.addCriteria(Criteria.where("timestamp").gte(start).lte(end));
        } else if (start != null) {
            query.addCriteria(Criteria.where("timestamp").gte(start));
        } else if (end != null) {
            query.addCriteria(Criteria.where("timestamp").lte(end));
        }

        if (categories != null && !categories.isEmpty()) {
            query.addCriteria(Criteria.where("category").in(categories));
        }

        List<Pin> pins = mongoTemplate.find(query, Pin.class);

        return pins.stream()
                .map(p -> new PinDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getDescription(),
                        p.getCategory(),
                        p.getLat(),
                        p.getLng(),
                        p.getCity(),
                        p.getArticleUrl(),
                        p.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public PinDTO createPin(CreatePinDTO dto) {
        // Build a Pin entity from the CreatePinDTO (all fields match types exactly)
        Pin pin = Pin.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .lat(dto.getLat())
                .lng(dto.getLng())
                .city(dto.getCity())
                .articleUrl(dto.getArticleUrl())
                .timestamp(dto.getTimestamp())
                .build();

        Pin saved = pinRepository.save(pin);
        return new PinDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getCategory(),
                saved.getLat(),
                saved.getLng(),
                saved.getCity(),
                saved.getArticleUrl(),
                saved.getTimestamp()
        );
    }

    @Override
    public PinDTO getPin(String id) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new PinNotFoundException("Pin not found with id: " + id));
        return new PinDTO(
                pin.getId(),
                pin.getTitle(),
                pin.getDescription(),
                pin.getCategory(),
                pin.getLat(),
                pin.getLng(),
                pin.getCity(),
                pin.getArticleUrl(),
                pin.getTimestamp()
        );
    }

    @Override
    public PinDTO updatePin(String id, CreatePinDTO dto) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new PinNotFoundException("Pin not found with id: " + id));

        pin.setTitle(dto.getTitle());
        pin.setDescription(dto.getDescription());
        pin.setCategory(dto.getCategory());
        pin.setLat(dto.getLat());
        pin.setLng(dto.getLng());
        pin.setCity(dto.getCity());
        pin.setArticleUrl(dto.getArticleUrl());
        pin.setTimestamp(dto.getTimestamp());

        Pin saved = pinRepository.save(pin);

        return new PinDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getCategory(),
                saved.getLat(),
                saved.getLng(),
                saved.getCity(),
                saved.getArticleUrl(),
                saved.getTimestamp()
        );
    }

    @Override
    public void deletePin(String id) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new PinNotFoundException("Pin not found with id: " + id));
        pinRepository.delete(pin);
    }
}
