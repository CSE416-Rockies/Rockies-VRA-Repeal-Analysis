package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;
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
        private Map<Race, Double> avgEffectiveDistricts;
        private Map<Race, Double> avgOpportunityDistricts;

        public EnsembleData() {}
        
        public int getPlans() { return this.plans; }
        public double getThreshold() { return this.threshold; }
        public String getModeSplit() { return this.modeSplit; }
        public Map<Race, Double> getAvgEffectiveDistricts() { return this.avgEffectiveDistricts; }
        public Map<Race, Double> getAvgOpportunityDistricts() { return this.avgOpportunityDistricts; }
    }
}