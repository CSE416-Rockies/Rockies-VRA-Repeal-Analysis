package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document("box-whisker-plots")
public class BoxWhiskerPlots extends StateDocument{

    /* private variables -------------------------------------- */
    private Map<String, List<EnsembleDetail>> raceBlind;
    private Map<String, List<EnsembleDetail>> vra;

    /* constructors ------------------------------------------- */
    public BoxWhiskerPlots() {}
    public BoxWhiskerPlots(String state, Map<String, List<EnsembleDetail>> raceBlind, Map<String, List<EnsembleDetail>> vra) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    /* methods ------------------------------------------------ */
    public Map<String, List<EnsembleDetail>> getRaceBlind() { return raceBlind; }
    public Map<String, List<EnsembleDetail>> getVra() { return vra; }

    /* static nested classes ---------------------------------- */
    public static class EnsembleDetail extends BoxStats{
        private int districtIndex;
        private double enacted;

        public EnsembleDetail() {}

        public int getDistrictIndex() { return districtIndex; }
        public double getEnacted() { return enacted; }
    }
}
