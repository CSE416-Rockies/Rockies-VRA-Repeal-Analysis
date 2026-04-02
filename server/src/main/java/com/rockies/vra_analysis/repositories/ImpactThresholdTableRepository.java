package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.ImpactThresholdTable;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ImpactThresholdTableRepository extends MongoRepository<ImpactThresholdTable, String>{
    ImpactThresholdTable findByState(String state);
}
