package com.rockies.vra_analysis.seeders;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.BoxStats;
import com.rockies.vra_analysis.models.BoxWhiskerPlotsME;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class BoxWhiskerMESeeder extends BaseSeeder{
    
    public BoxWhiskerMESeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    // no changes made from json
    public void seed(State state) throws Exception{
       if (alreadySeeded("box-whisker-plots-me", state)){
            System.out.println("Migration: Box WHiskers ME already populated. Skipping.");
            return;
       }

        String rbPath = jsonlPath(state, "rb_5000");
        String vraPath = jsonlPath(state, "vra_5000");
        String enactedCountPath = jsonPath(state, "enacted_effective");

        Map<Race, BoxStats> raceBlind = aggregateFromJsonl(rbPath);
        Map<Race, BoxStats> vra = aggregateFromJsonl(vraPath);
        Map<Race, Integer> enactedCounts = getEnactedCounts(enactedCountPath);

        BoxWhiskerPlotsME boxWhiskerME = new BoxWhiskerPlotsME(state, raceBlind, vra, enactedCounts);
        mongoTemplate.save(boxWhiskerME);
        System.out.println("Migration: Successfully seeded BoxWhiskerME for " + state);
    }


    private Map<Race, BoxStats> aggregateFromJsonl(String path) throws Exception {
        List<Double> blackCounts = new ArrayList<>();
        List<Double> latinoCounts = new ArrayList<>();
        List<Double> otherCounts = new ArrayList<>();

        InputStream is = new ClassPathResource(path).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.isBlank()) continue;
            JsonNode plan = mapper.readTree(line);
            blackCounts.add((double) plan.get("black_effective_score_cnt").asInt());
            latinoCounts.add((double) plan.get("latino_effective_score_cnt").asInt());
            otherCounts.add((double) plan.get("other_effective_score_cnt").asInt());
        }

        Map<Race, BoxStats> result = new HashMap<>();
        result.put(Race.BLACK, toBoxStats(blackCounts));
        result.put(Race.LATINO, toBoxStats(latinoCounts));
        result.put(Race.OTHER, toBoxStats(otherCounts));
        return result;
    }

    private BoxStats toBoxStats(List<Double> values) {
        Collections.sort(values);
        int n = values.size();
        double min = values.get(0);
        double max = values.get(n - 1);
        double median = percentile(values, 50);
        double q1 = percentile(values, 25);
        double q3 = percentile(values, 75);
        return new BoxStats(min, q1, median, q3, max);
    }

    private double percentile(List<Double> sorted, double p) {
        double idx = (p / 100.0) * (sorted.size() - 1);
        int lo = (int) Math.floor(idx);
        int hi = (int) Math.ceil(idx);
        if (lo == hi) return sorted.get(lo);
        return sorted.get(lo) + (idx - lo) * (sorted.get(hi) - sorted.get(lo)); // linear interpolation
    }

    private Map<Race, Integer> getEnactedCounts(String path) throws Exception{
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
}


