package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.util.Map;


@Document("box-whisker-plots-me")
public class BoxWhiskerPlotsME {

    @Id
    private String id;
    private String state;
    private Map<String, GroupEffectiveness> groups;

    public static class GroupEffectiveness {
        private BoxStats raceBlind;
        private BoxStats vra;
        private int enactedCount;

        public GroupEffectiveness(){}

        public BoxStats getRaceBlind() { return raceBlind; }
        public BoxStats getVra() { return vra; }
        public int getEnactedCount() { return enactedCount; }
    }

    public static class BoxStats{
        private double min;
        private double q1;
        private double median;
        private double q3;
        private double max;

        public BoxStats() {}

        public double getMin() { return min; }
        public double getQ1() { return q1; }
        public double getMedian() { return median; }
        public double getQ3() { return q3; }
        public double getMax() { return max; }
    }

    public BoxWhiskerPlotsME(){}

    public BoxWhiskerPlotsME(String state, Map<String, GroupEffectiveness> groups){
        this.state = state;
        this.groups = groups;
    }

    public String getId() { return id; }

    public String getState() {
        return state;
    }

    public Map<String, GroupEffectiveness> getGroups() {
        return groups;
    }



}