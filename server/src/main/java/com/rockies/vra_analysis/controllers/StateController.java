package com.rockies.vra_analysis.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rockies.vra_analysis.service.StateService;
import com.rockies.vra_analysis.models.*;

import java.util.List;

// import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/state/{stateName}")
@CrossOrigin(origins = "http://localhost:5173")

public class StateController {

    @Autowired
    private StateService stateService;

    @GetMapping("/ensembleSummary")
    public EnsembleSummary getEnsembleSummary(@PathVariable String stateName) {
        return stateService.getEnsembleSummary(stateName);
    }

    @GetMapping("/stateDetail")
    public StateDetail getStateDetail(@PathVariable String stateName) {
        return stateService.getStateDetail(stateName);
    }

    @GetMapping("/ensembleSplits")
    public EnsembleSplits getEnsembleSplits(@PathVariable String stateName) {
        return stateService.getEnsembleSplits(stateName);
    }

    @GetMapping("/boxWhiskers")
    public BoxWhiskerPlots getBoxWhiskers(@PathVariable String stateName) {
        System.out.println("requested boxwhisker");
        return stateService.getBoxWhiskers(stateName);
    }

    @GetMapping("/representatives")
    public List<Representative> getRepresentatives(@PathVariable String stateName) {
        return stateService.getRepresentatives(stateName);
    }

    @GetMapping("/gingles")
    public Gingles getGingles(@PathVariable String stateName) {
        System.out.println("requested gingels");
        return stateService.getGingles(stateName);
    }

    @GetMapping("/eiAnalysis")
    public EIAnalysis getEIAnalysis(@PathVariable String stateName) {
        return stateService.getEIAnalysis(stateName);
    }

    @GetMapping("/boxWhiskersME")
    public BoxWhiskerPlotsME getBoxWhiskersME(@PathVariable String stateName) {
        return stateService.getBoxWhiskersME(stateName);
    }

    @GetMapping("/ensembleHistogramME")
    public EnsembleHistogramME getEnsembleHistogramME(@PathVariable String stateName) {
        return stateService.getEnsembleHistogramME(stateName);
    }
}