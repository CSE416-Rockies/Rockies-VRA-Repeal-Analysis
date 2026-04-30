package com.rockies.vra_analysis.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum State {
    AR("AR", "Arkansas"),
    GA("GA", "Georgia");

    private final String value;
    private final String fullName;

    State(String value, String fullName) {
        this.value = value;
        this.fullName = fullName;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public String getFullName() {
        return fullName;
    }

    @JsonCreator
    public static State fromValue(String value) {
        for (State state : State.values()) {
            if (state.value.equalsIgnoreCase(value) || 
                state.fullName.equalsIgnoreCase(value)) return state;
        }
        throw new IllegalArgumentException("Unknown state: " + value);
    }
}