package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.StateDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateDetailRepository extends MongoRepository<StateDetail, String>{
    StateDetail findByState(State state);
}
