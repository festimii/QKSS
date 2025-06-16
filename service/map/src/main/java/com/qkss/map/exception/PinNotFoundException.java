package com.qkss.map.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PinNotFoundException extends RuntimeException {
    public PinNotFoundException(String message) {
        super(message);
    }
}