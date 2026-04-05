package com.rockies.vra_analysis.models;
import org.springframework.data.annotation.Id;

public abstract class StateDocument {
    @Id
    private String id;
    private String state;

    public StateDocument() {}
    public StateDocument(String state) { this.state = state; }

    public String getId() { return id; }
    public String getState() { return state; }
}