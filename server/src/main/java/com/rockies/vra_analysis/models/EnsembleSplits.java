package com.rockies.vra_analysis.models;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("ensemble-splits")
public class EnsembleSplits extends BaseEnsemble<EnsembleSplits.Splits> {

    public EnsembleSplits(){}

    public EnsembleSplits(String state, int totalDistricts, Map<String, Splits> raceBlind, Map<String, Splits> vra){
        super(state, totalDistricts, raceBlind, vra);
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
}
