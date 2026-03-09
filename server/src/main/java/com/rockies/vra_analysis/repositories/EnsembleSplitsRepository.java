package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.EnsembleSplits;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnsembleSplitsRepository extends MongoRepository<EnsembleSplits, String>{
    EnsembleSplits findByState(String state);
}
