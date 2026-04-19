package com.rockies.vra_analysis.seeders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.rockies.vra_analysis.models.ImpactThresholdTable;
import org.springframework.stereotype.Component;

@Component
public class ImpactThresholdTableSeeder extends BaseSeeder{
    
    public ImpactThresholdTableSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }


    public void seed(String state) throws Exception {
        if (alreadySeeded("impact-threshold-table", state)){
            System.out.println("Migration: Impact Threshold Table already populated. Skipping.");
            return;
        } 

        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "impact_threshold_table")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, ImpactThresholdTable.class));
        System.out.println("Migration: Successfully seeded ImpactThreshold for " + state);
    }
}
