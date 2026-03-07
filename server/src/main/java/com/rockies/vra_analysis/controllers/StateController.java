package com.rockies.vra_analysis.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rockies.vra_analysis.models.EnsembleSummary;
import com.rockies.vra_analysis.models.RacialPopulation;
import com.rockies.vra_analysis.models.StateDetail;
import com.rockies.vra_analysis.models.VoterDistribution;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class StateController {

    @GetMapping("/state/{stateName}/ensemble")
    public EnsembleSummary getEnsembleSummary(@PathVariable String stateName) {
        return switch(stateName){
            case "Georgia" -> new EnsembleSummary("Georgia", 5000, 1.0, 5000, 1.0);
            case "Delaware" -> new EnsembleSummary("Delaware", 1000, 1.0, 1000, 1.0);
            default -> null;
        };
    }

    @GetMapping("/state/{stateName}/detail")
    public StateDetail getStateDetail(@PathVariable String stateName) {
        return switch (stateName) {
            case "Georgia" ->{ 
                RacialPopulation racialPop = new RacialPopulation(
                    11029227, 5713139, 3650675, 1202185,
                    242643);
                VoterDistribution voterDist = new VoterDistribution(
                    "Republican", 48.50, 50.70, 0.70
                );
                yield new StateDetail("Georgia", racialPop, voterDist);
            }
            case "Delaware" ->{ 
                RacialPopulation racialPop = new RacialPopulation(
                    1031890, 636476, 240431, 108348,
                    46435);
                VoterDistribution voterDist = new VoterDistribution(
                    "Democrat", 56.50, 41.80, 1.50
                );
                yield new StateDetail("Delaware", racialPop, voterDist);
            }
            default -> null;
        };
    }


}