package com.rockies.vra_analysis.repositories;

import com.rockies.vra_analysis.models.Representative;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RepresentativeRepository extends MongoRepository<Representative, String> {
    List<Representative> findByState(String state);
}
