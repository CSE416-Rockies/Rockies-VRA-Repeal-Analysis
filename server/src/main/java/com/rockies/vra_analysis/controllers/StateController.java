package com.rockies.vra_analysis.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rockies.vra_analysis.service.StateService;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.*;

import java.util.List;

@RestController
@RequestMapping("/api/state/{stateName}")
@CrossOrigin(origins = "http://localhost:5173")

public class StateController {

    @Autowired
    private StateService stateService;

    @GetMapping("/ensembleSummary")
    public EnsembleSummary getEnsembleSummary(@PathVariable State stateName) {
        return stateService.getEnsembleSummary(stateName);
    }

    @GetMapping("/stateDetail")
    public StateDetail getStateDetail(@PathVariable State stateName) {
        return stateService.getStateDetail(stateName);
    }

    @GetMapping("/ensembleSplits")
    public EnsembleSplits getEnsembleSplits(@PathVariable State stateName) {
        return stateService.getEnsembleSplits(stateName);
    }

    @GetMapping("/boxWhiskers")
    public BoxWhiskerPlots getBoxWhiskers(@PathVariable State stateName) {
        System.out.println("requested boxwhisker");
        return stateService.getBoxWhiskers(stateName);
    }

    @GetMapping("/representatives")
    public List<Representative> getRepresentatives(@PathVariable State stateName) {
        return stateService.getRepresentatives(stateName);
    }

    @GetMapping("/gingles")
    public Gingles getGingles(@PathVariable State stateName) {
        System.out.println("requested gingles");
        return stateService.getGingles(stateName);
    }

    @GetMapping("/eiAnalysis")
    public EIAnalysis getEIAnalysis(@PathVariable State stateName) {
        return stateService.getEIAnalysis(stateName);
    }

    @GetMapping("/boxWhiskersME")
    public BoxWhiskerPlotsME getBoxWhiskersME(@PathVariable State stateName) {
        return stateService.getBoxWhiskersME(stateName);
    }

    @GetMapping("/ensembleHistogramME")
    public EnsembleHistogramME getEnsembleHistogramME(@PathVariable State stateName) {
        return stateService.getEnsembleHistogramME(stateName);
    }

    @GetMapping("/impactThresholdTable")
    public ImpactThresholdTable getImpactThresholdTable(@PathVariable State stateName) {
        return stateService.getImpactThresholdTable(stateName);
    }
}