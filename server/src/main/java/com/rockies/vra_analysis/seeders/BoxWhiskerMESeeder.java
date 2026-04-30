package com.rockies.vra_analysis.seeders;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.BoxWhiskerPlotsME;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class BoxWhiskerMESeeder extends BaseSeeder{
    
    public BoxWhiskerMESeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    // no changes made from json
    public void seed(State state) throws Exception{
       if (alreadySeeded("box-whisker-plots-me", state)) return;
       JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "box_whisker_me")).getInputStream());
       mongoTemplate.save(mapper.convertValue(root, BoxWhiskerPlotsME.class));
       System.out.println("Migration: Successfully seeded BoxWhiskerME for " + state);
    }
}


