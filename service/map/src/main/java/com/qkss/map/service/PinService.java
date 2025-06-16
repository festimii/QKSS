package com.qkss.map.service;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;

import java.util.List;



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
     * Delete the pin with the given id, or throw if not found.
     */
    void deletePin(String id);
}