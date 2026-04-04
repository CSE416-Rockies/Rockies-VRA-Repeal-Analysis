package com.rockies.vra_analysis.models;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.util.Map;

@Document("impact-threshold-table")
public class ImpactThresholdTable {
    @Id
    private String id;
    private String state;
    private Map<String, GroupThresholds> groups;    // per race
    private GroupThresholds aggregate;              // all minorities combined

    public ImpactThresholdTable(){};

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

    public String getId(){ return id; }
    public String getState() { return state; }
    public Map<String, GroupThresholds> getGroups() { return groups; }
    public GroupThresholds getAggregate() { return aggregate; }
}