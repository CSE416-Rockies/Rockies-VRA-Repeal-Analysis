package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

import java.util.List;
import java.util.Map;

@Document("box-whisker-plots")
public class BoxWhiskerPlots extends StateDocument{

    private Map<Race, List<EnsembleDetail>> raceBlind;
    private Map<Race, List<EnsembleDetail>> vra;

    public BoxWhiskerPlots() {}
    public BoxWhiskerPlots(State state, Map<Race, List<EnsembleDetail>> raceBlind, Map<Race, List<EnsembleDetail>> vra) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    public Map<Race, List<EnsembleDetail>> getRaceBlind() { return raceBlind; }
    public Map<Race, List<EnsembleDetail>> getVra() { return vra; }

    public static class EnsembleDetail extends BoxStats{
        private int districtIndex;
        private double enacted;

        public EnsembleDetail() {}

        public int getDistrictIndex() { return districtIndex; }
        public double getEnacted() { return enacted; }
    }
}
