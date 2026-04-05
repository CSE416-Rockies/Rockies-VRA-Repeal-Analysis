package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "ensemble-histogram-me")
public class EnsembleHistogramME extends StateDocument{
    
    /* private variables -------------------------------------- */
    private int totalDistricts;
    private Map<String, GroupCounts> raceBlind;
    private Map<String, GroupCounts> vra;

    /* constructors ------------------------------------------- */
    public EnsembleHistogramME() {}
    public EnsembleHistogramME(String state, int totalDistricts, Map<String, GroupCounts> raceBlind, Map<String, GroupCounts> vra) {
        super(state);
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }

    /* methods ------------------------------------------- */
    public int getTotalDistricts() { return totalDistricts; }
    public Map<String, GroupCounts> getRaceBlind() { return raceBlind; }
    public Map<String, GroupCounts> getVra() { return vra; }

   /* static nested classes ---------------------------------- */
    public static class GroupCounts {
        private int black;
        private int latino;
        private int other;

        public GroupCounts() {}
        
        public int getBlack()  { return black; }
        public int getLatino() { return latino; }
        public int getOther()  { return other; }
    }
}