package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

import org.springframework.data.annotation.Id;

@Document(collection = "ensemble-histogram-me")
public class EnsembleHistogramME{
    @Id
    private String id;
    private String state;
    private int totalDistricts;
    private Map<String, GroupCounts> raceBlind;
    private Map<String, GroupCounts> vra;
    
    public static class GroupCounts {
        private int black;
        private int latino;
        private int other;

        public int getBlack()  { return black; }
        public int getLatino() { return latino; }
        public int getOther()  { return other; }
    }

    public String getId() { return id; }
    public String getState() { return state; }
    public int getTotalDistricts() { return totalDistricts; }
    public Map<String, GroupCounts> getRaceBlind() { return raceBlind; }
    public Map<String, GroupCounts> getVra() { return vra; }
}