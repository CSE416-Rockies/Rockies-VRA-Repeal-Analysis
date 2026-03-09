package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.List;

@Document("box-whisker-plots")
public class BoxWhiskerPlots {
    @Id
    private String id;

    private String state;

    private List<Ensemble> ensembles;
    public static class Ensemble {
        private String name;
        private List<EnsembleDetail> white;
        private List<EnsembleDetail> black;
        private List<EnsembleDetail> latino;
        private List<EnsembleDetail> other;

        public String getName() { return name; }
        public List<EnsembleDetail> getWhite() { return white; }
        public List<EnsembleDetail> getBlack() { return black; }
        public List<EnsembleDetail> getLatino() { return latino; }
        public List<EnsembleDetail> getOther() { return other; }
    }
    public static class EnsembleDetail {
        private int districtIndex;
        private double min;
        private double q1;
        private double median;
        private double q3;
        private double max;
        private double enacted;

        public int getDistrictIndex() { return districtIndex; }
        public double getMin() { return min; }
        public double getQ1() { return q1; }
        public double getMedian() { return median; }
        public double getQ3() { return q3; }
        public double getMax() { return max; }
        public double getEnacted() { return enacted; }
    }

    public BoxWhiskerPlots(String state, List<Ensemble> ensembles) {
        this.state = state;
        this.ensembles = ensembles;
    }

    public String getState() {
        return state;
    }

    public List<Ensemble> getEnsembles() {
        return ensembles;
    }
}
