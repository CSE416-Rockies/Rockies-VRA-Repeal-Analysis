package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Field;;

public class RacialPopulation{
    @Field("totalPopulation")
    private int total;
    @Field("whitePopulation")
    private int white;
    @Field("blackPopulation")
    private int black;
    @Field("latinoPopulation")
    private int latino;
    @Field("otherPopulation")
    private int other;

    //constructor
    public RacialPopulation() {}

    public RacialPopulation(int total, int white, int black, int latino, int other){
        this.total = total;
        this.white = white;
        this.black = black;
        this.latino = latino;
        this.other = other;
    }

    //getters
    public int getTotal(){ return this.total; }
    public int getWhitePopulation() { return this.white; }
    public int getBlackPopulation() { return this.black; }
    public int getLatinoPopulation() { return this.latino; }
    public int getOtherPopulation() { return this.other; }
    public double getWhitePercentage() { return (double) white / total * 100; }
    public double getBlackPercentage() { return (double) black / total * 100; }
    public double getLatinoPercentage() { return (double) latino / total * 100; }
    public double getOtherPercentage() { return (double) other / total * 100; }
    
}