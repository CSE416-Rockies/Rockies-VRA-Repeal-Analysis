package com.rockies.vra_analysis.models;
import org.springframework.data.annotation.Id;

import com.rockies.vra_analysis.enums.State;

public abstract class StateDocument {
    @Id
    private String id;
    private State state;

    public StateDocument() {}
    public StateDocument(State state) { this.state = state; }

    public String getId() { return id; }
    public State getState() { return state; }
}