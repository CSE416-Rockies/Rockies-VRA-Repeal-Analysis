package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;


@Document("box-whisker-plots-me")
public class BoxWhiskerPlotsME extends StateDocument{

    /* private variables -------------------------------------- */
    private Map<String, BoxStats> raceBlind;
    private Map<String, BoxStats> vra;
    private Map<String, Integer> enactedCounts;

    /* constructors ------------------------------------------- */
    public BoxWhiskerPlotsME(){}
    public BoxWhiskerPlotsME(String state, Map<String, BoxStats> raceBlind, Map<String, BoxStats> vra, Map<String, Integer> enactedCounts) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
        this.enactedCounts = enactedCounts;
    }

    /* methods ------------------------------------------------ */
    public Map<String, BoxStats> getRaceBlind() { return raceBlind; }
    public Map<String, BoxStats> getVra() { return vra; }
    public Map<String, Integer> getEnactedCounts() { return enactedCounts; }
}