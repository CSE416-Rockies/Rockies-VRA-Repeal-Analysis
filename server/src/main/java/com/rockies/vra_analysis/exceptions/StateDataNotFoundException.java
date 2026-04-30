package com.rockies.vra_analysis.exceptions;

import com.rockies.vra_analysis.enums.State;

public class StateDataNotFoundException extends RuntimeException {
    public StateDataNotFoundException(State state, String dataType) {
        super("No " + dataType + " data found for state: " + state);
    }
}