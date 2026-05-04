package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

import java.util.Map;

@Document(collection = "ensemble-histogram-me")
public class EnsembleHistogramME extends StateDocument{
    
    private int totalDistricts;
    private Map<Race, Map<Integer, Integer>> raceBlind;
    private Map<Race, Map<Integer, Integer>> vra;

    public EnsembleHistogramME() {}
    public EnsembleHistogramME(State state, int totalDistricts, Map<Race, Map<Integer, Integer>> raceBlind, Map<Race, Map<Integer, Integer>> vra) {
        super(state);
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    public int getTotalDistricts() { return totalDistricts; }
    public Map<Race, Map<Integer, Integer>> getRaceBlind() { return raceBlind; }
    public Map<Race, Map<Integer, Integer>> getVra() { return vra; }
}