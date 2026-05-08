package com.rockies.vra_analysis.models;

public class BoxStats {
    
    private double min;
    private double q1;
    private double median;
    private double q3;
    private double max;

    public BoxStats() {}
    public BoxStats(double min, double q1, double median, double q3, double max){
        this.min = min;
        this.q1 = q1;
        this.median = median;
        this.q3 = q3;
        this.max = max;
    }

    public double getMin() { return min; }
    public double getQ1() { return q1; }
    public double getMedian() { return median; }
    public double getQ3() { return q3; }
    public double getMax() { return max; }
    
}
