package com.rockies.vra_analysis.seeders;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.BoxWhiskerPlots;
import com.rockies.vra_analysis.models.BoxWhiskerPlots.EnsembleDetail;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;


@Component
public class BoxWhiskerSeeder extends BaseSeeder{
    
    public BoxWhiskerSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(State state) throws Exception{
        
        if (alreadySeeded("box-whisker-plots", state)){
            System.out.println("Migration: BoxWhisker Plots already populated. Skipping.");
            return;
        } 
            
        // get race blind + vra constrain files 
        JsonNode rbRoot = mapper.readTree(new ClassPathResource(jsonPath(state, "box_whisker_rb")).getInputStream());
        JsonNode vraRoot = mapper.readTree(new ClassPathResource(jsonPath(state, "box_whisker_vra")).getInputStream());

        // build respective maps
        Map<Race, List<EnsembleDetail>> raceBlind = parseBoxWhisker(rbRoot.get("raceblind"));
        Map<Race, List<EnsembleDetail>> vra = parseBoxWhisker(vraRoot.get("vra"));

        // initilaize constructor
        State stateEnum = State.fromValue(rbRoot.get("state").asText());
        mongoTemplate.save(new BoxWhiskerPlots(stateEnum, raceBlind,  vra));
        System.out.println("Migration: Successfully seeded BoxWhisker for " + state);
        
    }


    private Map<Race, List<EnsembleDetail>> parseBoxWhisker(JsonNode node){
        Map<Race, List<EnsembleDetail>> res = new HashMap<>();

        node.properties().forEach(entry ->{

            // race
            Race race = Race.fromValue(entry.getKey());

            // ensemble details
            List<EnsembleDetail> details = new ArrayList<>();
            entry.getValue().forEach(e->details.add(mapper.convertValue(e, EnsembleDetail.class)));
            res.put(race, details);
        });

        return res;
    }
}
