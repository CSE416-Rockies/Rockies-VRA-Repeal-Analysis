package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Field;

public class VoterDistribution{
    private String partyControl;
    @Field("democratPercent")
    private double democratPercentage;
    @Field("republicanPercent")
    private double republicanPercentage;
    @Field("otherPercent")
    private double otherPercentage;

    //constructor
    public VoterDistribution() {}

    public VoterDistribution(String party, double democrat, double republican, double other){
        this.partyControl = party;
        this.democratPercentage = democrat;
        this.republicanPercentage = republican;
        this.otherPercentage = other;
    }
    //getters
    public String getPartyControl() { return this.partyControl; }
    public double getDemocratPercentage() {return this.democratPercentage; }
    public double getRepublicanPercentage() {return this.republicanPercentage; }
    public double getOtherPercentage() {return this.otherPercentage; }
}