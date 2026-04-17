package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Document("ei-analysis")

    public class EIAnalysis extends StateDocument{

        /* private variables -------------------------------------- */
        private Set<Candidate> candidates;

        /* constructors ------------------------------------------- */
        public EIAnalysis() {}
        public EIAnalysis(String state, Set<Candidate> candidates) {
            super(state);
            this.candidates = candidates;
        }

        /* methods ------------------------------------------------ */
        public Set<Candidate> getCandidates() {return candidates;}

        /* static nested classes ---------------------------------- */
        public static class Candidate{
            @Field("id")
            private String id; 
            private Map<Race, GroupResult> groups;

            public Candidate() {}

            public String getId() { return id; }
            public Map<Race, GroupResult> getGroups() {
                return groups;
            }
        }

        public static class GroupResult{
            @Field("posterior_mean")
            private PosteriorMean posteriorMean;
            @Field("credible_interval_95")
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
