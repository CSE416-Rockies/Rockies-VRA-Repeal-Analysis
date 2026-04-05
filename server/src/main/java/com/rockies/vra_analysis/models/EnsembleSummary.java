package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ensemble-summary")
public class EnsembleSummary extends StateDocument{
   
    /* private variables ------------------------------------------- */
    private int raceBlindPlans;
    private double raceBlindThreshold;
    private int vraPlans;
    private double vraThreshold;

    /* constructors ------------------------------------------- */
    public EnsembleSummary() {}
    public EnsembleSummary(String state, int raceBlindPlans, double raceBlindThreshold, int vraPlans, double vraThreshold){
        super(state);
        this.raceBlindPlans = raceBlindPlans;
        this.raceBlindThreshold = raceBlindThreshold;
        this.vraPlans = vraPlans;
        this.vraThreshold = vraThreshold;
    }

    /* methods ------------------------------------------- */
    public int getRaceBlindPlans() { return this.raceBlindPlans; }
    public double getRaceBlindThreshold() { return this.raceBlindThreshold; }
    public int getVraPlans() { return this.vraPlans; }
    public double getVraThreshold() { return this.vraThreshold; }
}