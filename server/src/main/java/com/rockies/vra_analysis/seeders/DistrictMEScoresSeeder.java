package com.rockies.vra_analysis.seeders;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.DistrictMEScores;

@Component
public class DistrictMEScoresSeeder extends BaseSeeder {

    public DistrictMEScoresSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper) {
        super(mongoTemplate, mapper);
    }

    public void seed(State state) throws Exception {
        if (alreadySeeded("district-scores-me", state)) return;

        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "scores")).getInputStream());

        Map<Integer, Map<Race, Double>> effective = pivot(root.get("effective"));
        Map<Integer, Map<Race, Double>> calibrated = pivot(root.get("calibrated"));

        mongoTemplate.save(new DistrictMEScores(effective, calibrated, state));
        System.out.println("Migration: Successfully seeded DistrictMEScores for " + state);
    }

    private Map<Integer, Map<Race, Double>> pivot(JsonNode raceToDistricts) {
        Map<Integer, Map<Race, Double>> result = new HashMap<>();

        raceToDistricts.properties().forEach(raceEntry -> {
            Race race = Race.fromValue(raceEntry.getKey());

            raceEntry.getValue().properties().forEach(districtEntry -> {
                int districtNum = Integer.parseInt(districtEntry.getKey().trim());  // there exists a space before the num
                double score = districtEntry.getValue().asDouble();
                result.computeIfAbsent(districtNum, k -> new HashMap<>()).put(race, score);
            });
        });

        return result;
    }
}