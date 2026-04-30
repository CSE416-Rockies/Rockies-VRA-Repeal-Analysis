package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.Gingles;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface GinglesRepository extends MongoRepository<Gingles, String>{
    Gingles findByState(State state);
}
