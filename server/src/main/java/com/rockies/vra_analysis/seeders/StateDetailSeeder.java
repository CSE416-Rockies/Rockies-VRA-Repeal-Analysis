package com.rockies.vra_analysis.seeders;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.models.StateDetail;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class StateDetailSeeder extends BaseSeeder{
    
    public StateDetailSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(String state) throws Exception{
        if (alreadySeeded("state-detail", state)){
            System.out.println("Migration: State Detail already populated. Skipping.");
            return;
        }

        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "state_detail")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, StateDetail.class));
        System.out.println("Migration: Successfully seeded StateDetail for " + state);
    }
}
