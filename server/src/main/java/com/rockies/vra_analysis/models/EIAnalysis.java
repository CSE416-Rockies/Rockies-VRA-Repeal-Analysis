package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;
import java.util.List;
import java.util.Map;

@Document("ei-analysis")

    public class EIAnalysis{

        
        @Id
        /* variables -------------------------------------- */
        private String id;
        private String state;

        private MCMC mcmc;
        private List<Candidate> candidates;

        /* methods ---------------------------------------- */
        public String getId() { return id; }
        public String getState() { return state; }
        public MCMC getMCMC() { return mcmc; }
        public List<Candidate> getCandidates() {return candidates;}

        /* classes ---------------------------------------- */
        public static class MCMC {
            private int iterations;
            private int burn_in;
            private int chains;

            public int getIterations() { return iterations; }
            public int getBurnIn() { return burn_in; }
            public int getChains() { return chains; }
            
        }

        public static class Candidate{
            @Field("id")
            private String id; 
            private String name;
            private String party;
            private Map<String, GroupResult> groups;

            public String getId() { return id; }
            public String getName() {return name; }
            public String getParty() { return party; }
            public Map<String, GroupResult> getGroups() {
                return groups;
            }
        }

        public static class GroupResult{
            private PosteriorMean posterior_mean;
            private CredibleInterval credible_interval_95;
            private Density density;

            public PosteriorMean getPosteriorMean() { return posterior_mean; }
            public CredibleInterval getCredibleInterval95() { return credible_interval_95; }
            public Density getDensity() { return density; }
        }
        
        public static class PosteriorMean{
            private double group;
            private double complement;

            public double getGroup() { return group; }
            public double getComplement() { return complement; }
        }

        public static class CredibleInterval {
            private List<Double> group;
            private List<Double> complement;

            public List<Double> getGroup() { return group; }
            public List<Double> getComplement() { return complement; }
        }

        public static class Density{
            private List<Point> group;
            private List<Point> complement;

            public List<Point> getGroup() { return group; }
            public List<Point> getComplement() { return complement; }
        }

        public static class Point {
            private double x;
            private double y;

            public double getX() { return x; }
            public double getY() { return y; }
        }
    }
