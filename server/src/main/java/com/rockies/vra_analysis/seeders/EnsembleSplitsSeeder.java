package com.rockies.vra_analysis.seeders;

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.tomcat.jni.Buffer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;
import com.rockies.vra_analysis.models.EnsembleSplits;

import java.util.HashMap;
import java.util.Map;


@Component
public class EnsembleSplitsSeeder extends BaseSeeder{
    
    public EnsembleSplitsSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(State state) throws Exception{
        if (alreadySeeded("ensemble-splits", state)) {
            System.out.println("Migration: Ensemble Splits already populated. Skipping.");
            return;
        }

        String rbPath = jsonlPath(state, "rb_5000");
        String vraPath = jsonlPath(state, "vra_5000");
        int totalDistricts = findTotalDistricts(rbPath);

        Map<Integer, Integer> raceBlind = aggregateFromJsonl(rbPath);
        Map<Integer, Integer> vra = aggregateFromJsonl(vraPath);

        EnsembleSplits splits = new EnsembleSplits(state, totalDistricts, raceBlind, vra);
        mongoTemplate.save(splits);
        System.out.println("Migration: Successfully seeded EnsembleSplits for " + state);
        
    }

    private int findTotalDistricts(String path) throws Exception{
        InputStream is = new ClassPathResource(path).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        String firstLine = reader.readLine();
        JsonNode plan = mapper.readTree(firstLine);
        return plan.get("republican_wins").asInt() + plan.get("democrat_wins").asInt();
    }

    private Map<Integer, Integer> aggregateFromJsonl(String path) throws Exception{
        InputStream is = new ClassPathResource(path).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        Map<Integer, Integer> counts = new HashMap<>();
        String line;
        while((line = reader.readLine()) != null){
            if (line.isBlank()) continue;
            JsonNode plan = mapper.readTree(line);

            int repWins = plan.get("republican_wins").asInt();
            counts.merge(repWins, 1, Integer::sum);
        }

        return counts;
    }
}
