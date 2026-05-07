package com.rockies.vra_analysis.seeders;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleSummary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

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
        JsonNode summaryRoot = mapper.readTree(new ClassPathResource(genJsonPath("ensemble_data")).getInputStream());
        JsonNode roughPropRoot = mapper.readTree(new ClassPathResource(genJsonPath("rough_proportionality")).getInputStream());
        
        JsonNode stateNode = null;
        for (JsonNode node : summaryRoot) {
            if (node.get("state").asText().equals(state.getFullName())) {
                stateNode = node;
                break;
            }
        }
        if (stateNode == null) throw new IllegalArgumentException("State not found in ensemble_data: " + state);
        
        EnsembleSummary.EnsembleData ensembleData = new EnsembleSummary.EnsembleData(
            stateNode.get("num_plans").asInt(),
            stateNode.get("population_threshold").asDouble()
        );

        Map<Race, Double> roughProportionality = parseRoughProp(roughPropRoot.get(state.getFullName()));
        
        mongoTemplate.save(new EnsembleSummary(state, ensembleData, ensembleData, roughProportionality));
        System.out.println("Migration: Successfully seeded EnsembleSummary for " + state);
    }

    private Map<Race, Double> parseRoughProp(JsonNode node){
        Map<Race, Double> res = new HashMap<>();
        node.properties().forEach(entry ->{
            Race race = Race.fromValue(entry.getKey());
            res.put(race, entry.getValue().asDouble());
        });
        return res;
    }
}
