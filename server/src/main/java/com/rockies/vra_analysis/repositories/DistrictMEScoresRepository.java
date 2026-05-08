package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.DistrictMEScores;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DistrictMEScoresRepository extends MongoRepository<DistrictMEScores, String>{
    DistrictMEScores findByState(State state);
}
