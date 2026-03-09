package com.rockies.vra_analysis.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rockies.vra_analysis.models.EnsembleSummary;
import com.rockies.vra_analysis.models.StateDetail;
import com.rockies.vra_analysis.models.BoxWhiskerPlots;
import com.rockies.vra_analysis.models.EnsembleSplits;
import com.rockies.vra_analysis.repositories.EnsembleSummaryRepository;
import com.rockies.vra_analysis.repositories.StateDetailRepository;
import com.rockies.vra_analysis.repositories.EnsembleSplitsRepository;
import com.rockies.vra_analysis.repositories.BoxWhiskerPlotsRepository;


import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/state/{stateName}")
@CrossOrigin(origins = "http://localhost:5173")

public class StateController {

    @Autowired
    private EnsembleSummaryRepository ensembleRepo;

    @Autowired
    private StateDetailRepository stateDetailRepo;

    @Autowired EnsembleSplitsRepository splitsRepo;

    @Autowired
    private BoxWhiskerPlotsRepository boxRepo;

    @GetMapping("/ensemble")
    public EnsembleSummary getEnsembleSummary(@PathVariable String stateName) {
        EnsembleSummary result = ensembleRepo.findByState(stateName);
        // System.out.println("Looking for: " + stateName + " → Found: " + result);
        return result;
    }

    @GetMapping("/detail")
    public StateDetail getStateDetail(@PathVariable String stateName) {
        StateDetail result = stateDetailRepo.findByState(stateName);
        // System.out.println("VoterDist: " + result.getVoterDistribution().getDemocratPercentage());
        return result;
    }

    @GetMapping("/ensembleSplits")
    public EnsembleSplits getEnsembleSplits(@PathVariable String stateName) {
        EnsembleSplits result = splitsRepo.findByState(stateName);
        return result;
    }

    @GetMapping("/boxWhiskers")
    public BoxWhiskerPlots getBoxWhiskers(@PathVariable String stateName) {
        BoxWhiskerPlots result = boxRepo.findByState(stateName);
        return result;
    }
}