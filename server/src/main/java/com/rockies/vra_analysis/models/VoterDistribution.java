package com.rockies.vra_analysis.models;

public class VoterDistribution{
    private final String partyControl;
    private final double democratPercentage;
    private final double republicanPercentage;
    private final double otherPercentage;

    //constructor
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