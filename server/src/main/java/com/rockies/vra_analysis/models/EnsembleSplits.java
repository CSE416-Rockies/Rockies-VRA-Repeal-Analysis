package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

import org.springframework.data.annotation.Id;

@Document("ensemble-splits")
public class EnsembleSplits {
    @Id
    private String id;
    private String state;
    private int totalDistricts;
    private Map<String, Splits> raceBlind;
    private Map<String, Splits> vra;

    public EnsembleSplits(){}

    public EnsembleSplits(String state, int totalDistricts, Map<String, Splits> raceBlind, Map<String, Splits> vra){
        this.state = state;
        this.totalDistricts = totalDistricts;
        this.raceBlind = raceBlind;
        this.vra = vra;
    }
    public static class Splits {
        private int total;
        private int white;
        private int black;
        private int latino;
        private int other;

        public Splits() {}

        public Splits(int total, int white, int black, int latino, int other){
            this.total = total;
            this.white = white;
            this.black = black;
            this.latino = latino;
            this.other = other;
        }

        public int getTotal() { return total; }
        public int getWhite() { return white; }
        public int getBlack() { return black; }
        public int getLatino() { return latino; }
        public int getOther() { return other; }
    }

    public String getId() { return id; }
    public String getState() { return state; }
    public int getTotalDistricts() { return totalDistricts; }
    public Map<String, Splits> getRaceBlind() { return raceBlind; }
    public Map<String, Splits> getVra() { return vra; }
}
