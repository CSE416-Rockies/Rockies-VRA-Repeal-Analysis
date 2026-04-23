package com.rockies.vra_analysis.seeders;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleSummary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class EnsembleSummarySeeder extends BaseSeeder{
    
    public EnsembleSummarySeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(State state) throws Exception {
        if (alreadySeeded("ensemble-summary", state)){
            System.out.println("Migration: Ensemble Summary already populated. Skipping.");
            return;
        } 
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "ensemble_summary")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, EnsembleSummary.class));
        System.out.println("Migration: Successfully seeded EnsembleSummary for " + state);
    }

}
