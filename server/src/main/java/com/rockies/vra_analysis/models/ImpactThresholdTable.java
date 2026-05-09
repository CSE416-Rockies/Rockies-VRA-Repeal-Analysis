package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;


import java.util.Map;

@Document("impact-threshold-table")
public class ImpactThresholdTable extends StateDocument {
    
    private Map<Race, GroupThresholds> groups;  

    public ImpactThresholdTable(){}
    public ImpactThresholdTable(State state, Map<Race, GroupThresholds> groups) {
        super(state); 
        this.groups = groups;
    }

    public Map<Race, GroupThresholds> getGroups() { return groups; }

    public static class GroupThresholds {
        private EnsembleProportion enactedThreshold;
        private EnsembleProportion proportionalThreshold;
        private EnsembleProportion bothThreshold;

        public GroupThresholds(){}
        public GroupThresholds(EnsembleProportion enacted, EnsembleProportion proportional, EnsembleProportion both) {
            this.enactedThreshold = enacted;
            this.proportionalThreshold = proportional;
            this.bothThreshold = both;
        }

        public EnsembleProportion getEnactedThreshold() { return enactedThreshold; }
        public EnsembleProportion getProportionalThreshold() { return proportionalThreshold; }
        public EnsembleProportion getBothThreshold() { return bothThreshold; }
    }

    public static class EnsembleProportion {
        private double raceBlind;
        private double vra;

        public EnsembleProportion(){}
        public EnsembleProportion(double raceBlind, double vra) {
            this.raceBlind = raceBlind;
            this.vra = vra;
        }

        public double getRaceBlind() { return raceBlind; }
        public double getVra() { return vra; }
    }
}