package com.rockies.vra_analysis.seeders;

import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Party;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EIAnalysis;
import com.rockies.vra_analysis.models.EIAnalysis.Candidate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.HashMap;

@Component
public class EIAnalysisSeeder extends BaseSeeder{
    public EIAnalysisSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(State state) throws Exception{
        if (alreadySeeded("ei-analysis", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "ei_models")).getInputStream());

        Map<Party, Candidate> candidates = new HashMap<>();

        // add party 
        root.get("candidates").forEach(entry ->{
            Candidate c = mapper.convertValue(entry, Candidate.class);
            String name = c.getCandidate();
            Party party = name.equals("harris") ? Party.DEMOCRAT : Party.REPUBLICAN;
            candidates.put(party, c);
        });

        State stateEnum = State.fromValue(root.get("state").asText());
        EIAnalysis analysis = new EIAnalysis(stateEnum, candidates);
        mongoTemplate.save(analysis);

        System.out.println("Migration: Successfully seeded EIAnalysis for " + state);
    }

}