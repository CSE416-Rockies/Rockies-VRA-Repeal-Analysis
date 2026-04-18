package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;


@Document("box-whisker-plots-me")
public class BoxWhiskerPlotsME extends StateDocument{

    /* private variables -------------------------------------- */
    private Map<Race, BoxStats> raceBlind;
    private Map<Race, BoxStats> vra;
    private Map<Race, Integer> enactedCounts;

    /* constructors ------------------------------------------- */
    public BoxWhiskerPlotsME(){}
    public BoxWhiskerPlotsME(String state, Map<Race, BoxStats> raceBlind, Map<Race, BoxStats> vra, Map<Race, Integer> enactedCounts) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
        this.enactedCounts = enactedCounts;
    }

    /* methods ------------------------------------------------ */
    public Map<Race, BoxStats> getRaceBlind() { return raceBlind; }
    public Map<Race, BoxStats> getVra() { return vra; }
    public Map<Race, Integer> getEnactedCounts() { return enactedCounts; }
}