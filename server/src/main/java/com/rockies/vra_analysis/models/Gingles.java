package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;
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

    public void setRegression(Regression regression) { this.regression = regression; }

    /* static nested classes ---------------------------------------- */
    public static class Regression{
        private Map<Race, Map<Party, RegressionFit>> fits;

        public Regression(){}
        public Regression(Map<Race, Map<Party, RegressionFit>> fits){this.fits = fits;}

        public  Map<Race, Map<Party, RegressionFit>>  getFits() { return fits; }
    }

    public static class RegressionFit{
        private String candidate;
        private String model;
        private Map<String, Double> params;

        public RegressionFit() {}

        public String getCandidate() { return candidate; }
        public String getModel() { return model; }
        public Map<String, Double> getParams() { return params; }
    }

    
    public static class Precinct{
        @Field("id")
        private int id;
        private Map<Race, Double> groups;
        private Map<Party, Double> partyVoteShares;

        public Precinct(){}
        
        @JsonCreator
        public Precinct(
            @JsonProperty("id") int id,
            @JsonProperty("groups") Map<Race, Double> groups,
            @JsonProperty("harris_vote_share") double harris,
            @JsonProperty("trump_vote_share") double trump
        ) {
            this.id = id;
            this.groups = groups;
            this.partyVoteShares = Map.of(
                Party.DEMOCRAT, harris,
                Party.REPUBLICAN, trump
            );
        }

        public int getId() { return id; }
        public Map<Race, Double> getGroups() { return groups; }
        public Map<Party, Double> getPartyShares() { return partyVoteShares; }

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