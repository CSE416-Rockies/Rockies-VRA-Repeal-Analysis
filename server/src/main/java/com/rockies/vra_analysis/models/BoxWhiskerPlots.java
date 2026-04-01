package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.Map;

@Document("box-whisker-plots")
public class BoxWhiskerPlots {
    @Id
    private String id;
    private String state;

    private Map<String, List<EnsembleDetail>> raceBlind;
    private Map<String, List<EnsembleDetail>> vra;

    public static class EnsembleDetail {
        private int districtIndex;
        private double min;
        private double q1;
        private double median;
        private double q3;
        private double max;
        private double enacted;

        public EnsembleDetail() {}

        public int getDistrictIndex() { return districtIndex; }
        public double getMin() { return min; }
        public double getQ1() { return q1; }
        public double getMedian() { return median; }
        public double getQ3() { return q3; }
        public double getMax() { return max; }
        public double getEnacted() { return enacted; }
    }

    public BoxWhiskerPlots() {}

    public BoxWhiskerPlots(String state, Map<String, List<EnsembleDetail>> raceBlind, Map<String, List<EnsembleDetail>> vra) {
        this.state = state;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    public String getState() {
        return state;
    }

    public String getId() { return id; }
    public Map<String, List<EnsembleDetail>> getRaceBlind() { return raceBlind; }
    public Map<String, List<EnsembleDetail>> getVra() { return vra; }
}
