package com.rockies.vra_analysis.seeders;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleHistogramME;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import com.rockies.vra_analysis.models.EnsembleHistogramME.GroupCounts;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

@Component
public class EnsembleHistogramMESeeder extends BaseSeeder{

    public EnsembleHistogramMESeeder(MongoTemplate mongoTemplate, ObjectMapper mapper) {
        super(mongoTemplate, mapper);
    }
    
    public void seed(State state) throws Exception{
        if (alreadySeeded("ensemble-histogram-me", state)){
            System.out.println("Migration: Ensemble Histogram ME already populated. Skipping.");
            return;
        }

        InputStream inputStream = new ClassPathResource(jsonPath(state, "ensemble_histogram_me")).getInputStream();
        JsonNode root = mapper.readTree(inputStream);

        int totalDistricts = root.get("totalDistricts").asInt();
        Map<Integer, GroupCounts> raceBlind = parseGroupCounts(root.get("raceBlind"));
        Map<Integer, GroupCounts> vra = parseGroupCounts(root.get("vra"));

        EnsembleHistogramME histogram = new EnsembleHistogramME(state, totalDistricts, raceBlind, vra);
        mongoTemplate.save(histogram);
        System.out.println("Migration: Successfully seeded EnsembleHistogramME for " + state);
    }

    private Map<Integer, GroupCounts> parseGroupCounts(JsonNode node){
        Map<Integer, GroupCounts> res = new HashMap<>();

        // for each # of minority effective districts

        node.properties().forEach(entry ->{
            int district = Integer.parseInt(entry.getKey());
            JsonNode counts = entry.getValue();

            // build counts for each race
            Map<Race, Integer> raceCounts = new HashMap<>();

            counts.properties().forEach(e -> raceCounts.put(Race.fromValue(e.getKey()), e.getValue().asInt()));
            res.put(district, new GroupCounts(raceCounts));

        });

        return res;
    } 
}
