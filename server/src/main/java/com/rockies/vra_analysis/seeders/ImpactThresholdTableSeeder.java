package com.rockies.vra_analysis.seeders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.ImpactThresholdTable;
import com.rockies.vra_analysis.models.ImpactThresholdTable.EnsembleProportion;
import com.rockies.vra_analysis.models.ImpactThresholdTable.GroupThresholds;

import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class ImpactThresholdTableSeeder extends BaseSeeder{
    
    public ImpactThresholdTableSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }


    public void seed(State state) throws Exception {
        if (alreadySeeded("impact-threshold-table", state)){
            System.out.println("Migration: Impact Threshold Table already populated. Skipping.");
            return;
        } 

        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "impact_threshold")).getInputStream());

        Map<Race, GroupThresholds> groups = new HashMap<>();

        root.get("groups").properties().forEach(entry -> {
            Race race = Race.fromValue(entry.getKey());
            JsonNode groupNode = entry.getValue();

            GroupThresholds group = new GroupThresholds(
                buildProportion(groupNode.get("enactedThreshold")),
                buildProportion(groupNode.get("proportionalThreshold")),
                buildProportion(groupNode.get("bothThreshold"))
            );

            groups.put(race, group);
        });

        State stateEnum = State.fromValue(root.get("state").asText());
        mongoTemplate.save(new ImpactThresholdTable(stateEnum, groups));
        System.out.println("Migration: Successfully seeded ImpactThreshold for " + state);
    }

    private EnsembleProportion buildProportion(JsonNode node) {
        double raceBlind = node.get("raceBlind").asDouble() / 5000.0;
        double vra = node.get("vra").asDouble() / 5000.0;
        return new EnsembleProportion(raceBlind, vra);
    }
}
