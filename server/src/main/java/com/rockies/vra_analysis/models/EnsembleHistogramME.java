package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "ensemble-histogram-me")
public class EnsembleHistogramME extends BaseEnsemble<EnsembleHistogramME.GroupCounts> {
    /* ----------------------------------------- constructors */
    public EnsembleHistogramME() {}
    
    public EnsembleHistogramME(String state, int totalDistricts, Map<String, GroupCounts> raceBlind, Map<String, GroupCounts> vra) {
        super(state, totalDistricts, raceBlind, vra);
    }

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