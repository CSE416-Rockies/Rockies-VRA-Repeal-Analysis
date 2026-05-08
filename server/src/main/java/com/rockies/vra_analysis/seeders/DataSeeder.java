
package com.rockies.vra_analysis.seeders;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.rockies.vra_analysis.enums.State;


@Component
public class DataSeeder implements CommandLineRunner {

    private final GinglesSeeder ginglesSeeder;
    private final EIAnalysisSeeder eiAnalysisSeeder;
    private final ImpactThresholdTableSeeder impactThresholdSeeder;
    private final StateDetailSeeder stateDetailSeeder;
    private final EnsembleSummarySeeder ensembleSummarySeeder;
    private final BoxWhiskerSeeder boxWhiskerSeeder;
    private final BoxWhiskerMESeeder boxWhiskerMESeeder;
    private final EnsembleSplitsSeeder ensembleSplitsSeeder;
    private final EnsembleHistogramMESeeder ensembleHistogramMESeeder;
    private final DistrictMEScoresSeeder districtMEScoresSeeder;

    public DataSeeder(GinglesSeeder ginglesSeeder, EIAnalysisSeeder eiAnalysisSeeder, 
            ImpactThresholdTableSeeder impactThresholdSeeder, 
            StateDetailSeeder stateDetailSeeder, 
            EnsembleSummarySeeder ensembleSummarySeeder,BoxWhiskerSeeder boxWhiskerSeeder,
            BoxWhiskerMESeeder boxWhiskerMESeeder,EnsembleSplitsSeeder ensembleSplitsSeeder,
            EnsembleHistogramMESeeder ensembleHistogramMESeeder, DistrictMEScoresSeeder districtMEScoresSeeder) {

        this.ginglesSeeder = ginglesSeeder;
        this.eiAnalysisSeeder = eiAnalysisSeeder;
        this.stateDetailSeeder = stateDetailSeeder;
        this.impactThresholdSeeder = impactThresholdSeeder;
        this.ensembleSummarySeeder = ensembleSummarySeeder;
        this.boxWhiskerSeeder = boxWhiskerSeeder;
        this.boxWhiskerMESeeder = boxWhiskerMESeeder;
        this.ensembleSplitsSeeder = ensembleSplitsSeeder;
        this.ensembleHistogramMESeeder = ensembleHistogramMESeeder;
        this.districtMEScoresSeeder = districtMEScoresSeeder;
    }

    @Override
    public void run(String... args) throws Exception {
        for (State state : State.values()) {
            ginglesSeeder.seed(state);
            eiAnalysisSeeder.seed(state);
            stateDetailSeeder.seed(state);
            impactThresholdSeeder.seed(state);
            ensembleSummarySeeder.seed(state);
            boxWhiskerSeeder.seed(state);
            boxWhiskerMESeeder.seed(state);
            ensembleSplitsSeeder.seed(state);
            ensembleHistogramMESeeder.seed(state);
            districtMEScoresSeeder.seed(state);
        }
    }
    
}