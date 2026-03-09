package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

import org.springframework.data.annotation.Id;

@Document("ensemble-splits")
public class EnsembleSplits {
    @Id
    private String id;
    private String state;
    private int totalDistricts;
    private Map<String, Splits> raceBlind;
    private Map<String, Splits> vra;

    public EnsembleSplits(){}

    public EnsembleSplits(String state, int totalDistricts, Map<String, Splits> raceBlind, Map<String, Splits> vra){
        this.state = state;
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    public String getId() { return id; }
    public String getName() { return state; }
    public int getTotalDistricts() { return totalDistricts; }
    public Map<String, Splits> getRaceBlind() { return raceBlind; }
    public Map<String, Splits> getVra() { return vra; }
}
