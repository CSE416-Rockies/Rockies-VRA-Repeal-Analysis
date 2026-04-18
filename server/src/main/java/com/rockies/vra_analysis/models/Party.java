package com.rockies.vra_analysis.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Party {
    DEMOCRAT("democrat"),
    REPUBLICAN("republican"),
    OTHER("other");

    private final String value;

    Party(String value) { this.value = value; }

    @JsonValue
    public String getValue() { return value; }

    @JsonCreator
    public static Party fromValue(String value) {
        for (Party party : Party.values()) {
            if (party.value.equalsIgnoreCase(value)) return party;
        }
        throw new IllegalArgumentException("Unknown party: " + value);
    }
}


