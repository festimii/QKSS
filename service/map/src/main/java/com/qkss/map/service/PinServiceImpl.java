package com.qkss.map.service;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;
import com.qkss.map.exception.PinNotFoundException;
import com.qkss.map.model.Pin;
import com.qkss.map.repository.PinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PinServiceImpl implements PinService {
    private final PinRepository pinRepository;

    @Override
    public List<PinDTO> listPins() {
        return pinRepository.findAll()
                .stream()
                .map(pin -> new PinDTO(
                        pin.getId(),
                        pin.getTitle(),
                        pin.getLat(),
                        pin.getLng(),
                        pin.getArticleUrl()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public PinDTO createPin(CreatePinDTO dto) {
        // Build a Pin entity from the CreatePinDTO (all fields match types exactly)
        Pin pin = Pin.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .lat(dto.getLat())
                .lng(dto.getLng())
                .city(dto.getCity())
                .articleUrl(dto.getArticleUrl())
                .build();

        Pin saved = pinRepository.save(pin);
        return new PinDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getLat(),
                saved.getLng(),
                saved.getArticleUrl()
        );
    }

    @Override
    public PinDTO getPin(String id) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new PinNotFoundException("Pin not found with id: " + id));
        return new PinDTO(
                pin.getId(),
                pin.getTitle(),
                pin.getLat(),
                pin.getLng(),
                pin.getArticleUrl()
        );
    }

    @Override
    public void deletePin(String id) {
        Pin pin = pinRepository.findById(id)
                .orElseThrow(() -> new PinNotFoundException("Pin not found with id: " + id));
        pinRepository.delete(pin);
    }
}
