package com.nyaysetu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuplicateSlotException extends RuntimeException {
    public DuplicateSlotException(String message) {
        super(message);
    }
}
