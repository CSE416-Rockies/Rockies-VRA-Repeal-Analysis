package com.rockies.vra_analysis.seeders;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.fasterxml.jackson.databind.JsonNode;

import com.rockies.vra_analysis.models.Gingles;
import com.rockies.vra_analysis.models.Party;
import com.rockies.vra_analysis.models.Race;

import com.rockies.vra_analysis.models.Gingles.RegressionFit;
import com.rockies.vra_analysis.models.Gingles.Precinct;
import com.rockies.vra_analysis.models.Gingles.Regression;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class GinglesSeeder extends BaseSeeder {
    
    public GinglesSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        super(mongoTemplate, mapper);
    }

    public void seed(String state) throws Exception{
        if (alreadySeeded("gingles", state)){
            System.out.println("Migration: Gingles already populated. Skipping.");
            return;
        }

        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "gingles_results")).getInputStream());

        Map<Race, Map<Party, RegressionFit>> fits = new HashMap<>();

        root.get("regression").get("fits").properties().forEach(entry ->{
            
            // get race
            Race race = Race.fromValue(entry.getKey());

            // build party map
            Map<Party, RegressionFit> partyMap = new HashMap<>();
            entry.getValue().forEach(e -> {
                String candidateName = e.get("candidate").asText();
                Party party = candidateName.equals("harris") ? Party.DEMOCRAT : Party.REPUBLICAN;
                RegressionFit fit = mapper.convertValue(e, RegressionFit.class);
                partyMap.put(party, fit);
            });

            fits.put(race, partyMap);
        });

        // build precinct set
        Set<Precinct> precincts = new HashSet<>();
        root.get("precincts").forEach(e -> precincts.add(mapper.convertValue(e, Precinct.class)));

        mongoTemplate.save(new Gingles(root.get("state").asText(), new Regression(fits), precincts));
        System.out.println("Migration: Successfully seeded Gingles for " + state);
    }
}