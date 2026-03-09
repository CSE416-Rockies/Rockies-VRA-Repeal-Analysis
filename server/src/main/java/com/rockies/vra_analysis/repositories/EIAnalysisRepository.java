package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.EIAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface EIAnalysisRepository extends MongoRepository<EIAnalysis, String>{
    EIAnalysis findByState(String state);
}
