package com.rockies.vra_analysis.models;
import org.springframework.data.annotation.Id;
import java.util.Map;


public abstract class BaseEnsemble<T> {
    @Id
    private String id;
    private String state;
    private int totalDistricts;
    private Map<String, T> raceBlind;
    private Map<String, T> vra;

    public BaseEnsemble() {}

    public BaseEnsemble(String state, int totalDistricts, Map<String, T> raceBlind, Map<String, T> vra) {
        this.state = state;
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    public String getId() { return id; }
    public String getState() { return state; }
    public int getTotalDistricts() { return totalDistricts; }
    public Map<String, T> getRaceBlind() { return raceBlind; }
    public Map<String, T> getVra() { return vra; }
}