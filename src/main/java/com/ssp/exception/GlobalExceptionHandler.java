package com.ssp.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssp.response.MessageResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors from @Valid annotation
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle constraint violation exceptions
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<MessageResponse> handleConstraintViolationException(
            ConstraintViolationException ex) {
        
        MessageResponse errorResponse = new MessageResponse("Validation failed: " + ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<MessageResponse> handleAccessDeniedException(Exception ex) {
        return new ResponseEntity<>(
            new MessageResponse("Access denied"),
            HttpStatus.FORBIDDEN
        );
    }
    
    /**
     * Handle generic exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGenericException(Exception ex) {
        MessageResponse errorResponse = new MessageResponse("An error occurred: " + ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(
            new MessageResponse(ex.getMessage()),
            HttpStatus.UNAUTHORIZED
        );
    }
}