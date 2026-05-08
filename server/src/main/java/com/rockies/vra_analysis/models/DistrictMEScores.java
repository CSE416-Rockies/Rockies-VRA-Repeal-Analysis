package com.rockies.vra_analysis.models;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

@Document("district-scores-me")
public class DistrictMEScores extends StateDocument{
    private Map<Integer, Map<Race, Double>> calculated;
    private Map<Integer, Map<Race, Double>> calibrated;

    public DistrictMEScores() {}

    public DistrictMEScores(
        Map<Integer, Map<Race, Double>> calculated,
        Map<Integer, Map<Race, Double>> calibrated,
        State state
    ) {
        super(state);
        this.calculated = calculated;
        this.calibrated = calibrated;
    }

    public Map<Integer, Map<Race, Double>> getCalculated() {
        return calculated;
    }

    public Map<Integer, Map<Race, Double>> getCalibrated() {
        return calibrated;
    }
}
