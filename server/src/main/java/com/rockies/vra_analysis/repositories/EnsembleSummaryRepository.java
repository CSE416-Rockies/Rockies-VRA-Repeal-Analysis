package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.EnsembleSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnsembleSummaryRepository extends MongoRepository<EnsembleSummary, String> {
    EnsembleSummary findByState(String state);
}
