package com.rockies.vra_analysis.models;

public class EnsembleSummary{
    private final String state;
    private final int raceBlindPlans;
    private final double raceBlindThreshold;
    private final int vraPlans;
    private final double vraThreshold;

    public EnsembleSummary(String state, int raceBlindPlans, double raceBlindThreshold, int vraPlans, double vraThreshold){
        this.state = state;
        this.raceBlindPlans = raceBlindPlans;
        this.raceBlindThreshold = raceBlindThreshold;
        this.vraPlans = vraPlans;
        this.vraThreshold = vraThreshold;
    }

    public String getState() { return this.state; }
    public int getRaceBlindPlans() { return this.raceBlindPlans; }
    public double getRaceBlindThreshold() { return this.raceBlindThreshold; }
    public int getVraPlans() { return this.vraPlans; }
    public double getVraThreshold() { return this.vraThreshold; }
}