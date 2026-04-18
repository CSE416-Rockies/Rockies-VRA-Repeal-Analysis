package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("ensemble-splits")
public class EnsembleSplits extends StateDocument {
   
    /* private variables ------------------------------------------- */
    private int totalDistricts;
    private Map<Integer, Splits> raceBlind;
    private Map<Integer, Splits> vra;

    /* constructors ------------------------------------------------ */
    public EnsembleSplits(){}
    public EnsembleSplits(String state, int totalDistricts, Map<Integer, Splits> raceBlind, Map<Integer, Splits> vra){
        super(state);
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    /* methods ------------------------------------------------------ */
    public int getTotalDistricts() { return totalDistricts; }
    public Map<Integer, Splits> getRaceBlind() { return raceBlind; }
    public Map<Integer, Splits> getVra() { return vra; }

    /* static nested classes ---------------------------------------- */

    public static class Splits {
        private int total;
        private Map<Race, Integer> splits;

        public Splits() {}
        public Splits(int total, Map<Race, Integer> splits) {
            this.total = total;
            this.splits = splits;
        }

        public int getTotal() { return total; }
        public Map<Race, Integer> getSplits() { return splits; }
        public int getRaceSplit(Race race) { return splits.getOrDefault(race, 0); }
    }
}
