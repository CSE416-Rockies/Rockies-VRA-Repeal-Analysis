package com.rockies.vra_analysis.seeders;

import java.io.InputStream;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import com.rockies.vra_analysis.models.EnsembleSplits;
import com.rockies.vra_analysis.models.EnsembleSplits.Splits;
import com.rockies.vra_analysis.models.Race;

import java.util.HashMap;
import java.util.Map;


@Component
public class EnsembleSplitsSeeder extends BaseSeeder{
    
    public EnsembleSplitsSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(String state) throws Exception{
        if (alreadySeeded("ensemble-splits", state)) {
            System.out.println("Migration: Ensemble Splits already populated. Skipping.");
            return;
        }

        InputStream inputStream = new ClassPathResource(jsonPath(state, "ensemble_splits")).getInputStream();
        JsonNode root = mapper.readTree(inputStream);

        int totalDistricts = root.get("totalDistricts").asInt();

        // build ensemble maps
        Map<Integer, Splits> raceBlind = parseSplits(root.get("raceBlind"));
        Map<Integer, Splits> vra = parseSplits(root.get("vra"));

        EnsembleSplits splits = new EnsembleSplits(state, totalDistricts, raceBlind, vra);
        mongoTemplate.save(splits);
        System.out.println("Migration: Successfully seeded EnsembleSplits for " + state);
    }

    private Map<Integer, EnsembleSplits.Splits> parseSplits(JsonNode node) {

        Map<Integer, Splits> result = new HashMap<>();

        // for each district
        node.properties().forEach(entry -> {

            int district = Integer.parseInt(entry.getKey());
            JsonNode splitsNode = entry.getValue();
            int total = splitsNode.has("total") ? splitsNode.get("total").asInt() : 0;
            Map<Race, Integer> raceSplits = new HashMap<>();
            
            splitsNode.properties().forEach(r -> {
                if (!r.getKey().equals("total")) {
                    raceSplits.put(Race.fromValue(r.getKey()), r.getValue().asInt());
                }
            });

            result.put(district, new Splits(total, raceSplits));
        });
        return result;
    }
}
