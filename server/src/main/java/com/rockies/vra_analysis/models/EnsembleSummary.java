package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ensemble-summary")
public class EnsembleSummary extends StateDocument{
   
    /* private variables ------------------------------------------- */
    private EnsembleData raceBlind;
    private EnsembleData vra;

    /* constructors ------------------------------------------- */
    public EnsembleSummary() {}
    public EnsembleSummary(String state, EnsembleData raceBlind, EnsembleData vra) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    /* methods ------------------------------------------- */
    public EnsembleData getRaceBlind() { return this.raceBlind; }
    public EnsembleData getVra() { return this.vra; }

    /* nested class ------------------------------------------- */
    public static class EnsembleData {
        private int plans;
        private double threshold;
        private String modeSplit;
        private double avgMinorityEffective;
        private double avgOpportunityDistricts;

        public EnsembleData() {}
        
        public int getPlans() { return this.plans; }
        public double getThreshold() { return this.threshold; }
        public String getModeSplit() { return this.modeSplit; }
        public double getAvgMinorityEffective() { return this.avgMinorityEffective; }
        public double getAvgOpportunityDistricts() { return this.avgOpportunityDistricts; }
    }
}