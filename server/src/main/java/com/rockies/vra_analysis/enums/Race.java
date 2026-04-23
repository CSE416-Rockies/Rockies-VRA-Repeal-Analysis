package com.rockies.vra_analysis.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Race {
    WHITE("white"),
    BLACK("black"),
    LATINO("latino"),
    OTHER("other");

    private final String value;
    
    Race(String value){
        this.value = value;
    }

    @JsonValue
    public String getValue(){
        return value;
    }
    
    @JsonCreator
    public static Race fromValue(String value){
        for (Race race : Race.values()){
            if (race.value.equalsIgnoreCase(value)) return race;
        }
        throw new IllegalArgumentException("Unknown race: " + value);   
    }
}
