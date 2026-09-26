package com.taskmanager.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception) {

        String message = exception.getMessage();

        HttpStatus status = HttpStatus.CONFLICT;

        if ("Invalid email or password".equals(message)) {
            status = HttpStatus.UNAUTHORIZED;
        }

        return ResponseEntity
                .status(status)
                .body(Map.of(
                        "status", status.value(),
                        "message", message
                ));
    }
}