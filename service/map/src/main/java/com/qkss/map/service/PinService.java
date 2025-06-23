package com.qkss.map.service;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;

import java.util.List;
import java.time.Instant;



public interface PinService {
    /**
     * Retrieve all pins as DTOs.
     */
    List<PinDTO> listPins();

    /**
     * Create a new Pin from the provided DTO and return the saved DTO.
     */
    PinDTO createPin(CreatePinDTO createPinDTO);

    /**
     * Update the pin with the given id using the provided DTO and return
     * the updated DTO.
     */
    PinDTO updatePin(String id, CreatePinDTO updateDto);

    /**
     * Retrieve a single pin by id or throw if not found.
     */
    PinDTO getPin(String id);

    /**
     * Delete the pin with the given id, or throw if not found.
     */
    void deletePin(String id);

    /**
     * Retrieve pins filtered by optional category list and time range.
     */
    List<PinDTO> listPinsFiltered(List<String> categories, Instant start, Instant end);
}