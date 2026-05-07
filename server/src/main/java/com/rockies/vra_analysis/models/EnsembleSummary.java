package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import java.util.Map;

@Document(collection = "ensemble-summary")
public class EnsembleSummary extends StateDocument{
   
    private EnsembleData raceBlind;
    private EnsembleData vra;
    private Map<Race, Double> roughProp;

    public EnsembleSummary() {}
    public EnsembleSummary(State state, EnsembleData raceBlind, EnsembleData vra, Map<Race, Double> roughProp) {
        super(state);
        this.raceBlind = raceBlind;
        this.vra = vra;
        this.roughProp = roughProp;
    }

    public EnsembleData getRaceBlind() { return this.raceBlind; }
    public EnsembleData getVra() { return this.vra; }
    public Map<Race, Double> getRoughProp() { return this.roughProp; }

    public static class EnsembleData {
        private int plans;
        private double threshold;

        public EnsembleData() {}
        public EnsembleData(int plans, double threshold) {  
            this.plans = plans;
            this.threshold = threshold;
        }
        
        public int getPlans() { return this.plans; }
        public double getThreshold() { return this.threshold; }
    }
}