package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;
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
    
}