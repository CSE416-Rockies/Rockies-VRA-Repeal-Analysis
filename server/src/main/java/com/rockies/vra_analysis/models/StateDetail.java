package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("state-detail")
public class StateDetail extends StateDocument{
   
    /* private variables -------------------------------------- */
    private RacialPopulation racialPopulation;
    private VoterDistribution voterDistribution;

    /* constructor --------------------------------------------- */
    public StateDetail(){}
    public StateDetail(String state, RacialPopulation racialPopulation, VoterDistribution voterDistribution){
        super(state);
        this.racialPopulation = racialPopulation;
        this.voterDistribution = voterDistribution;
    }

    /* constructor --------------------------------------------- */
    public RacialPopulation getRacialPopulation() { return this.racialPopulation; }
    public VoterDistribution getVoterDistribution() { return this.voterDistribution; }

    /* static nested classes ----------------------------------- */
    public static class VoterDistribution{
        private String partyControl;
        @Field("democratPercent")
        private double democratPercentage;
        @Field("republicanPercent")
        private double republicanPercentage;
        @Field("otherPercent")
        private double otherPercentage;

        public VoterDistribution() {}

        public String getPartyControl() { return this.partyControl; }
        public double getDemocratPercentage() {return this.democratPercentage; }
        public double getRepublicanPercentage() {return this.republicanPercentage; }
        public double getOtherPercentage() {return this.otherPercentage; }
    }

    public static class RacialPopulation{
        @Field("totalPopulation")
        private int total;
        @Field("whitePopulation")
        private int white;
        @Field("blackPopulation")
        private int black;
        @Field("latinoPopulation")
        private int latino;
        @Field("otherPopulation")
        private int other;

        public RacialPopulation() {}

        public int getTotal(){ return this.total; }
        public int getWhitePopulation() { return this.white; }
        public int getBlackPopulation() { return this.black; }
        public int getLatinoPopulation() { return this.latino; }
        public int getOtherPopulation() { return this.other; }
        public double getWhitePercentage() { return (double) white / total * 100; }
        public double getBlackPercentage() { return (double) black / total * 100; }
        public double getLatinoPercentage() { return (double) latino / total * 100; }
        public double getOtherPercentage() { return (double) other / total * 100; }
        
    }
    
}
