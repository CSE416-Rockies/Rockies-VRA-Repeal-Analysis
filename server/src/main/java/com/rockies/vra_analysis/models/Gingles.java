package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;
import java.util.List;
import java.util.Map;

@Document("gingles")

    public class Gingles{

        @Id
        /* variables -------------------------------------- */
        private String id;
        private String state;

        private Regression regression;
        private List<Precinct> precincts;

        /* constructors ---------------------------------------- */
        public Gingles(){}

        public Gingles(String state, Regression regression, List<Precinct> precincts) {
            this.state = state;
            this.regression = regression;
            this.precincts = precincts;
        }
        
        /* methods ---------------------------------------- */
        public String getId() { return id; }
        public String getState() { return state; }
        public Regression getRegression() { return regression; }
        public List<Precinct> getPrecincts() {return precincts;}

        /* classes ---------------------------------------- */
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

            private double b0;
            private double b1;

            public Candidate() {}

            @Field("se_b0")
            private double seB0;
            @Field("se_b1")
            private double seB1;
            @Field("r_squared")
            private double rSquared;

            public String getCandidate() { return candidate; }
            public double getB0() { return b0; }
            public double getB1() { return b1; }
            public double getSeB0() { return seB0; }
            public double getSeB1() { return seB1; }
            public double getRSquared() { return rSquared; }
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
