package com.rockies.vra_analysis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.rockies.vra_analysis.exceptions.StateDataNotFoundException;
import com.rockies.vra_analysis.models.*;
import com.rockies.vra_analysis.repositories.*;

import java.util.List;


@Service
public class StateService {

    @Autowired 
    private EnsembleSummaryRepository ensembleRepo;

    @Autowired 
    private StateDetailRepository stateDetailRepo;

    @Autowired 
    private EnsembleSplitsRepository splitsRepo;

    @Autowired 
    private BoxWhiskerPlotsRepository boxRepo;

    @Autowired 
    private BoxWhiskerPlotsMERepository boxMERepo;

    @Autowired 
    private GinglesRepository ginglesRepo;

    @Autowired 
    private EIAnalysisRepository eiRepo;

    @Autowired 
    private EnsembleHistogramMERepository ensembleHistMERepo;
    
    @Autowired 
    private RepresentativeRepository representativeRepo;

    @Autowired 
    private ImpactThresholdTableRepository impactThresholdTableRepo;

    /*  */

    @Cacheable("ensemble-summary")
    public EnsembleSummary getEnsembleSummary(String state) {
        EnsembleSummary result = ensembleRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "ensemble summary");
        return result;
    }

    @Cacheable("state-detail")
    public StateDetail getStateDetail(String state) {
        StateDetail result = stateDetailRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "state detail");
        return result;
    }

    @Cacheable("ensemble-splits")
    public EnsembleSplits getEnsembleSplits(String state) {
        EnsembleSplits result = splitsRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "ensemble splits");
        return result;
    }

    @Cacheable("box-whisker-plots")
    public BoxWhiskerPlots getBoxWhiskers(String state) {
        BoxWhiskerPlots result = boxRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "box-whisker");
        return result;
    }

    @Cacheable("representatives")
    public List<Representative> getRepresentatives(String state) {
        List<Representative> result = representativeRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "representatives");
        return result;
    }

    @Cacheable("gingles")
    public Gingles getGingles(String state) {
        Gingles result = ginglesRepo.findByState(state);
        if(result == null) throw new StateDataNotFoundException(state, "gingles");
        return result;
    }

    @Cacheable("ei-analysis")
    public EIAnalysis getEIAnalysis(String state) {
        EIAnalysis result = eiRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "ei analysis");
        return result;
    }

    @Cacheable("box-whisker-plots-me")
    public BoxWhiskerPlotsME getBoxWhiskersME(String state) {
        BoxWhiskerPlotsME result = boxMERepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "box-whisker ME");
        return result;
    }

    @Cacheable("ensemble-histogram-me")
    public EnsembleHistogramME getEnsembleHistogramME(String state) {
        EnsembleHistogramME result = ensembleHistMERepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "ensemble histogram ME");
        return result;
    }

    @Cacheable("impact-threshold-table")
    public ImpactThresholdTable getImpactThresholdTable(String state) {
        ImpactThresholdTable result = impactThresholdTableRepo.findByState(state);
        if (result == null) throw new StateDataNotFoundException(state, "impact threshold table");
        return result;
    }
}