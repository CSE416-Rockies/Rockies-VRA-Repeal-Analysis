package com.rockies.vra_analysis;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.rockies.vra_analysis.exceptions.StateDataNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(StateDataNotFoundException.class)
    ResponseEntity<Object> handleNotFound(StateDataNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex){
        String msg = "Invalid state: '" + ex.getValue() + "'. Accepted values: AR, GA";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg); 
    }
    
}
