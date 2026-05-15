package com.rockies.vra_analysis.seeders;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleHistogramME;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

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

        String rbPath = jsonlPath(state, "rb_5000");
        String vraPath = jsonlPath(state, "vra_5000");
        String enactedCountPath = jsonPath(state, "enacted_effective");

        Map<Race, Map<Integer, Integer>> raceBlind = aggregateFromJsonl(rbPath);
        Map<Race, Map<Integer, Integer>> vra = aggregateFromJsonl(vraPath);
        Map<Race, Integer> enactedCounts = getEnactedCounts(enactedCountPath);
        int totalDistricts = findTotalDistricts(rbPath);

        EnsembleHistogramME histogram = new EnsembleHistogramME(state, totalDistricts, raceBlind, vra, enactedCounts);
        mongoTemplate.save(histogram);
        System.out.println("Migration: Successfully seeded EnsembleHistogramME for " + state);
    }

    private Map<Race, Integer> getEnactedCounts(String path) throws Exception {
        InputStream is = new ClassPathResource(path).getInputStream();
        JsonNode root = mapper.readTree(is);

        JsonNode demographics = root.get("Demographic");
        JsonNode effectiveDistricts = root.get("Effective_Districts");

        Map<Race, Integer> counts = new HashMap<>();
        for (int i = 0; i < demographics.size(); i++) {
            Race race = Race.fromValue(demographics.get(String.valueOf(i)).asText());
            counts.put(race, effectiveDistricts.get(String.valueOf(i)).asInt());
        }
        return counts;
    }

    private int findTotalDistricts(String path) throws Exception{
        InputStream is = new ClassPathResource(path).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String firstLine = reader.readLine();
        JsonNode plan = mapper.readTree(firstLine);
        return plan.get("republican_wins").asInt() + plan.get("democrat_wins").asInt();     // = num districts
    }

    private Map<Race, Map<Integer, Integer>> aggregateFromJsonl(String path) throws Exception{
        InputStream is = new ClassPathResource(path).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        Map<Race, Map<Integer, Integer>> counts = new HashMap<>();
        counts.put(Race.BLACK, new HashMap<>());
        counts.put(Race.LATINO, new HashMap<>());
        counts.put(Race.OTHER, new HashMap<>());

        // assemble map of minority-effective district counts
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.isBlank()) continue;               
            JsonNode plan = mapper.readTree(line);

            int blackCount = plan.get("black_effective_score_cnt").asInt();
            int latinoCount = plan.get("latino_effective_score_cnt").asInt();
            int otherCount = plan.path("other_effective_score_cnt").asInt(0);

            counts.get(Race.BLACK).merge(blackCount, 1, Integer::sum);
            counts.get(Race.LATINO).merge(latinoCount, 1, Integer::sum);
            counts.get(Race.OTHER).merge(otherCount, 1, Integer::sum);
        }

        return counts;
    }
}
