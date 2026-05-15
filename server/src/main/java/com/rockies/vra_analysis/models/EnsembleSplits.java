package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.State;

import java.util.List;
import java.util.Map;

@Document("ensemble-splits")
public class EnsembleSplits extends StateDocument {
   
    private int totalDistricts;
    private Map<Integer, Integer> raceBlind;  
    private Map<Integer, Integer> vra;
    private List<Integer> enacted;

    public EnsembleSplits(){}
    public EnsembleSplits(State state, int totalDistricts, Map<Integer, Integer> raceBlind, Map<Integer, Integer> vra, List<Integer> enacted){
        super(state);
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
        this.enacted = enacted;
    }

    public int getTotalDistricts() { return totalDistricts; }
    public Map<Integer, Integer> getRaceBlind() { return raceBlind; }
    public Map<Integer, Integer> getVra() { return vra; }
    public List<Integer> getEnacted() { return enacted; }
}
