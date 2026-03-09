package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;
import java.util.List;

@Document("gingles")

    public class Gingles{

        @Id
        /* variables -------------------------------------- */
        private String id;
        private String state;

        private Regression regression;
        private List<Precinct> precincts;

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

            public String getModel() { return model; }
            public String getFormula() { return formula; }
            public List<Group> getFits() { return fits; }

        }

        public static class Group{
            private String group;
            private List<Candidate> candidates;

            public String getGroup() { return group; }
            public List<Candidate> getCandidates() { return candidates; }
        }

        public static class Candidate{
            private String candidate;

            private double b0;
            private double b1;

            private double se_b0;
            private double se_b1;

            private double r_squared;

            public String getCandidate() { return candidate; }
            public double getB0() { return b0; }
            public double getB1() { return b1; }
            public double getSe_b0() { return se_b0; }
            public double getSe_b1() { return se_b1; }
            public double getR_squared() { return r_squared; }
        }

        public static class Precinct{
            private int id;
            private List<GroupPoint> groups;

            public int getId() { return id; }
            public List<GroupPoint> getGroups() { return groups;}
        }

        public static class GroupPoint{
            private String group;
            @Field("pct_demo")
            private double pctDemo;
            private double harris;
            private double trump;

            public String getGroup() { return group; }
            public double getPctDemo() { return pctDemo;}
            public double getHarris() { return harris;}
            public double getTrump() { return trump;}
        }
    }
