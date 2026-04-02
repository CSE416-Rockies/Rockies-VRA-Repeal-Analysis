package com.rockies.vra_analysis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

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
        return ensembleRepo.findByState(state);
    }

    @Cacheable("state-detail")
    public StateDetail getStateDetail(String state) {
        return stateDetailRepo.findByState(state);
    }

    @Cacheable("ensemble-splits")
    public EnsembleSplits getEnsembleSplits(String state) {
        return splitsRepo.findByState(state);
    }

    @Cacheable("box-whisker-plots")
    public BoxWhiskerPlots getBoxWhiskers(String state) {
        System.out.println("CACHE - hitting MongoDB for boxwhisker: " + state);
        return boxRepo.findByState(state);
    }

    @Cacheable("representatives")
    public List<Representative> getRepresentatives(String state) {
        return representativeRepo.findByState(state);
    }

    @Cacheable("gingles")
    public Gingles getGingles(String state) {
        System.out.println("CACHE - hitting MongoDB for gingles: " + state);
        return ginglesRepo.findByState(state);
    }

    @Cacheable("ei-analysis")
    public EIAnalysis getEIAnalysis(String state) {
        return eiRepo.findByState(state);
    }

    @Cacheable("box-whisker-plots-me")
    public BoxWhiskerPlotsME getBoxWhiskersME(String state) {
        return boxMERepo.findByState(state);
    }

    @Cacheable("ensemble-histogram-me")
    public EnsembleHistogramME getEnsembleHistogramME(String state) {
        return ensembleHistMERepo.findByState(state);
    }

    @Cacheable("impact-threshold-table")
    public ImpactThresholdTable getImpactThresholdTable(String state) {
        return impactThresholdTableRepo.findByState(state);
    }
}