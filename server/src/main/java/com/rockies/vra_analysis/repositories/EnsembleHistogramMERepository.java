package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleHistogramME;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface EnsembleHistogramMERepository extends MongoRepository<EnsembleHistogramME, String>{
    EnsembleHistogramME findByState(State state);
}
