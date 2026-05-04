package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;

import java.util.Map;

@Document("impact-threshold-table")
public class ImpactThresholdTable extends StateDocument {
    
    private Map<Race, GroupThresholds> groups;  

    public ImpactThresholdTable(){}

    public Map<Race, GroupThresholds> getGroups() { return groups; }

    public static class GroupThresholds {
        private EnsembleProportion enactedThreshold;
        private EnsembleProportion proportionalThreshold;
        private EnsembleProportion bothThreshold;

        public static class EnsembleProportion {
            private double raceBlind;
            private double vra;

            public double getRaceBlind() { return raceBlind; }
            public double getVra() { return vra; }
        }

        public EnsembleProportion getEnactedThreshold() { return enactedThreshold; }
        public EnsembleProportion getProportionalThreshold() { return proportionalThreshold; }
        public EnsembleProportion getBothThreshold() { return bothThreshold; }
    }
}