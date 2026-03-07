package com.rockies.vra_analysis.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rockies.vra_analysis.models.EnsembleSummary;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class StateController {

    @GetMapping("/state/{stateName}")
    public EnsembleSummary getEnsembleSummary(@PathVariable String stateName) {
        return switch(stateName){
            case "Georgia" -> new EnsembleSummary("Georgia", 5000, 1.0, 5000, 1.0);
            case "Delaware" -> new EnsembleSummary("Delaware", 1000, 1.0, 1000, 1.0);
            default -> null;
        };
    }
}