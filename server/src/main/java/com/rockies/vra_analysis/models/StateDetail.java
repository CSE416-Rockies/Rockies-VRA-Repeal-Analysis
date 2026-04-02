package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;

@Document(collection = "state-detail")
public class StateDetail{
    @Id
    private String id;
    private String state;
    private RacialPopulation racialPopulation;
    private VoterDistribution voterDistribution;

    
    //constructor
    public StateDetail(){}

    public StateDetail(String name, RacialPopulation racialPopulation, VoterDistribution voterDistribution){
        this.state = name;
        this.racialPopulation = racialPopulation;
        this.voterDistribution = voterDistribution;
    }

    //getters
    public String getId() { return this.id; }
    public String getName() { return this.state; }
    public RacialPopulation getRacialPopulation() { return this.racialPopulation; }
    public VoterDistribution getVoterDistribution() { return this.voterDistribution; }

    // static classes

    public static class VoterDistribution{
        private String partyControl;
        @Field("democratPercent")
        private double democratPercentage;
        @Field("republicanPercent")
        private double republicanPercentage;
        @Field("otherPercent")
        private double otherPercentage;

        //constructor
        public VoterDistribution() {}

        //getters
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

        //constructor
        public RacialPopulation() {}

        //getters
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
