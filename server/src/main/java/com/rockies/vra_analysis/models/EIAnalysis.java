package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rockies.vra_analysis.enums.Party;
import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

import java.util.List;
import java.util.Map;

@Document("ei-analysis")
public class EIAnalysis extends StateDocument{
    private Map<Party, Candidate> candidates;

    public EIAnalysis() {}
    public EIAnalysis(State state, Map<Party, Candidate> candidates) {
        super(state);
        this.candidates = candidates;
    }

    public Map<Party, Candidate> getCandidates() { return candidates; }

    public static class Candidate{
        @JsonProperty("id")
        private String candidate; 
        private Map<Race, GroupResult> groups;

        public Candidate() {}

        public String getCandidate() { return candidate; }
        public Map<Race, GroupResult> getGroups() {
            return groups;
        }
    }

    public static class GroupResult{
        @JsonProperty("posterior_mean")
        private double posteriorMean;
        @JsonProperty("credible_interval_95")
        private List<Double> credibleInterval95;
        private List<Point> density;
        private double overlap;

        public GroupResult() {}

        public double getPosteriorMean() { return posteriorMean; }
        public List<Double> getCredibleInterval95() { return credibleInterval95; }
        public List<Point> getDensity() { return density; }
        public double getOverlap() { return overlap; }
    }

    public static class Point {
        private double x;
        private double y;

        public Point() {}

        public double getX() { return x; }
        public double getY() { return y; }
    }
}
