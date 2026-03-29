package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.BoxWhiskerPlotsME;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface BoxWhiskerPlotsMERepository extends MongoRepository<BoxWhiskerPlotsME, String>{
    BoxWhiskerPlotsME findByState(String state);
}
