package com.rockies.vra_analysis.models;

public class StateDetail{
    private final String name;
    private final RacialPopulation racialPopulation;
    private final VoterDistribution voterDistribution;

    //constructor
    public StateDetail(String name, RacialPopulation racialPopulation, VoterDistribution voterDistribution){
        this.name = name;
        this.racialPopulation = racialPopulation;
        this.voterDistribution = voterDistribution;
    }

    //getters
    public String getName() { return this.name; }
    public RacialPopulation getRacialPopulation() { return this.racialPopulation; }
    public VoterDistribution getVoterDistribution() { return this.voterDistribution; }
    
}