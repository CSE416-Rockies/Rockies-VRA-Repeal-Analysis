package com.rockies.vra_analysis.models;

public class Splits {
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
