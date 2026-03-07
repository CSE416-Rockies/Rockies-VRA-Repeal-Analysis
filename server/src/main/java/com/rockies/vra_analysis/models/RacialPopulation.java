package com.rockies.vra_analysis.models;

public class RacialPopulation{
    private final int total;
    private final int white;
    private final int black;
    private final int latino;
    private final int other;
    private final double whitePercentage;
    private final double blackPercentage;
    private final double latinoPercentage;
    private final double otherPercentage;

    //constructor
    public RacialPopulation(int total, int white, int black, int latino, int other){
        this.total = total;
        this.white = white;
        this.black = black;
        this.latino = latino;
        this.other = other;
        this.whitePercentage = (double) white/total*100;
        this.blackPercentage = (double) black/total*100;
        this.latinoPercentage = (double) latino/total*100;
        this.otherPercentage = (double) other/total*100;
    }

    //getters
    public int getTotal(){ return this.total; }
    public int getWhitePopulation() { return this.white; }
    public int getBlackPopulation() { return this.black; }
    public int getLatinoPopulation() { return this.latino; }
    public int getOtherPopulation() { return this.other; }
    public double getWhitePercentage() { return this.whitePercentage; }
    public double getBlackPercentage() { return this.blackPercentage; }
    public double getLatinoPercentage() { return this.latinoPercentage; }
    public double getOtherPercentage() { return this.otherPercentage; }
    
}