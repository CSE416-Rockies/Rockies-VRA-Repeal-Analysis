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

        /* private variables -------------------------------------- */
       private Map<Party, Candidate> candidates;

        /* constructors ------------------------------------------- */
        public EIAnalysis() {}
        public EIAnalysis(State state, Map<Party, Candidate> candidates) {
            super(state);
            this.candidates = candidates;
        }

        /* methods ------------------------------------------------ */
        public Map<Party, Candidate> getCandidates() { return candidates; }

        /* static nested classes ---------------------------------- */
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
            private PosteriorMean posteriorMean;
            @JsonProperty("credible_interval_95")
            private CredibleInterval credibleInterval95;
            private Density density;

            public GroupResult() {}

            public PosteriorMean getPosteriorMean() { return posteriorMean; }
            public CredibleInterval getCredibleInterval95() { return credibleInterval95; }
            public Density getDensity() { return density; }
        }
        
        public static class PosteriorMean{
            private double group;
            private double complement;

            public PosteriorMean() {}

            public double getGroup() { return group; }
            public double getComplement() { return complement; }
        }

        public static class CredibleInterval {
            private List<Double> group;
            private List<Double> complement;

            public CredibleInterval() {}

            public List<Double> getGroup() { return group; }
            public List<Double> getComplement() { return complement; }
        }

        public static class Density{
            private List<Point> group;
            private List<Point> complement;

            public Density() {}

            public List<Point> getGroup() { return group; }
            public List<Point> getComplement() { return complement; }
        }

        public static class Point {
            private double x;
            private double y;

            public Point() {}

            public double getX() { return x; }
            public double getY() { return y; }
        }
    }
