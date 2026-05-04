package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

import java.util.Map;


@Document("box-whisker-plots-me")
public class BoxWhiskerPlotsME extends StateDocument{

    private Map<Race, BoxStats> raceBlind;
    private Map<Race, BoxStats> vra;
    private Map<Race, Integer> enactedCounts;

    public BoxWhiskerPlotsME(){}
    public BoxWhiskerPlotsME(State state, Map<Race, BoxStats> raceBlind, Map<Race, BoxStats> vra, Map<Race, Integer> enactedCounts) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
        this.enactedCounts = enactedCounts;
    }

    public Map<Race, BoxStats> getRaceBlind() { return raceBlind; }
    public Map<Race, BoxStats> getVra() { return vra; }
    public Map<Race, Integer> getEnactedCounts() { return enactedCounts; }
}