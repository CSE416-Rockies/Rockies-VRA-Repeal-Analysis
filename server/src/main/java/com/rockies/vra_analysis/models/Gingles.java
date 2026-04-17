package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Set;
import java.util.Objects;
import java.util.Map;

@Document("gingles")

public class Gingles extends StateDocument{

    /* private variables ------------------------------------------- */
    private Regression regression;
    private Set<Precinct> precincts;

    /* constructors ------------------------------------------------ */
    public Gingles(){}
    public Gingles(String state, Regression regression, Set<Precinct> precincts) {
        super(state);
        this.regression = regression;
        this.precincts = precincts;
    }
    
    /* methods ------------------------------------------------------ */
    public Regression getRegression() { return regression; }
    public Set<Precinct> getPrecincts() {return precincts;}

    /* static nested classes ---------------------------------------- */
    public static class Regression{
        private Map<Race, Set<Candidate>> fits;

        public Regression(){}

        public  Map<Race, Set<Candidate>>  getFits() { return fits; }
    }

    public static class Candidate{
        private String candidate;
        private String model;
        private Map<String, Double> params;

        public Candidate() {}

        public String getCandidate() { return candidate; }
        public String getModel() { return model; }
        public Map<String, Double> getParams() { return params; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Candidate)) return false;
            Candidate c = (Candidate) o;
            return Objects.equals(candidate, c.candidate);
        }

        @Override
        public int hashCode() {
            return Objects.hash(candidate);
        }
    }

    public static class Precinct{
        @Field("id")
        private int id;
        private Map<Race, Double> groups;

        @Field("harris_vote_share")
        private double harrisVoteShare;
        @Field("trump_vote_share")
        private double trumpVoteShare;

        public Precinct(){}

        public int getId() { return id; }
        public Map<Race, Double> getGroups() { return groups; }
        public double getHarrisVoteShare() { return harrisVoteShare; }
        public double getTrumpVoteShare() { return trumpVoteShare; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Precinct)) return false;
            Precinct p = (Precinct) o;
            return id == p.id;
        }

        @Override
        public int hashCode() {
            return Integer.hashCode(id);
        }
    }
}