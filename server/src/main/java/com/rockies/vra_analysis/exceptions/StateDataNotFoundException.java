package com.rockies.vra_analysis.exceptions;

public class StateDataNotFoundException extends RuntimeException {
    public StateDataNotFoundException(String state, String dataType) {
        super("No " + dataType + " data found for state: " + state);
    }
}