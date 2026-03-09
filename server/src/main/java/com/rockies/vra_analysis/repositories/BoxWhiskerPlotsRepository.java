package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.BoxWhiskerPlots;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface BoxWhiskerPlotsRepository extends MongoRepository<BoxWhiskerPlots, String>{
    BoxWhiskerPlots findByState(String state);
}
