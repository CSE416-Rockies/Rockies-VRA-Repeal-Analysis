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
        private String model;
        private String formula;
        private List<Group> fits;

        public Regression(){}

        public String getModel() { return model; }
        public String getFormula() { return formula; }
        public List<Group> getFits() { return fits; }
    }

    public static class Group{
        private String group;
        private List<Candidate> candidates;

        public Group(){}

        public String getGroup() { return group; }
        public List<Candidate> getCandidates() { return candidates; }
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
        private Map<String, GroupPoint> groups;

        public Precinct(){}

        public int getId() { return id; }
        public Map<String, GroupPoint> getGroups() { return groups; }
    }
    public static class GroupPoint{
        @Field("pct_demo")
        private double pctDemo;
        private double harris;
        private double trump;

        public GroupPoint(){}

        public double getPctDemo() { return pctDemo;}
        public double getHarris() { return harris;}
        public double getTrump() { return trump;}
    }
}