package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

@Document("gingles")

public class Gingles extends StateDocument{

    /* private variables ------------------------------------------- */
    private Regression regression;
    private List<Precinct> precincts;

    /* constructors ------------------------------------------------ */
    public Gingles(){}
    public Gingles(String state, Regression regression, List<Precinct> precincts) {
        super(state);
        this.regression = regression;
        this.precincts = precincts;
    }
    
    /* methods ------------------------------------------------------ */
    public Regression getRegression() { return regression; }
    public List<Precinct> getPrecincts() {return precincts;}

    /* static nested classes ---------------------------------------- */
    public static class Regression{
        private Map<String, List<Candidate>> fits;

        public Regression(){}

        public  Map<String, List<Candidate>>  getFits() { return fits; }
    }

    public static class Candidate{
        private String candidate;
        private String model;
        private String formula;
        private Map<String, Double> params;

        public Candidate() {}

        public String getCandidate() { return candidate; }
        public String getModel() { return model; }
        public String getFormula() { return formula; }
        public Map<String, Double> getParams() { return params; }
    }

    public static class Precinct{
        private int id;
        private Map<String, Double> groups;
        
        @Field("harris_vote_share")
        private double harrisVoteShare;
        @Field("trump_vote_share")
        private double trumpVoteShare;

        public Precinct(){}

        public int getId() { return id; }
        public Map<String, Double> getGroups() { return groups; }
        public double getHarrisVoteShare() { return harrisVoteShare; }
        public double getTrumpVoteShare() { return trumpVoteShare; }
    }
}