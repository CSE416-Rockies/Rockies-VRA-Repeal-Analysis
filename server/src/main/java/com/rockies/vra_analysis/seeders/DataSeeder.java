
package com.rockies.vra_analysis.seeders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rockies.vra_analysis.models.StateDetail;
import com.rockies.vra_analysis.models.EnsembleSplits;
import com.rockies.vra_analysis.models.EnsembleSummary;
import com.rockies.vra_analysis.models.Gingles;
import com.rockies.vra_analysis.models.ImpactThresholdTable;
import com.rockies.vra_analysis.models.Party;
import com.rockies.vra_analysis.models.BoxWhiskerPlots;
import com.rockies.vra_analysis.models.BoxWhiskerPlotsME;
import com.rockies.vra_analysis.models.EIAnalysis;
import com.rockies.vra_analysis.models.EnsembleHistogramME;
import com.rockies.vra_analysis.models.Race;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.query.Query;

import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final ObjectMapper mapper;

    private static final Map<String, String> STATE_CODES = Map.of(
        "Arkansas", "ar",
        "Georgia",  "ga"
    );

    // path to  preprocessing jsons
    private String jsonPath(String state, String fileName) {
        return "data/" + state + "/" + STATE_CODES.get(state) + "_" + fileName + ".json";
    }

    public DataSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper) {
        this.mongoTemplate = mongoTemplate;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        for (String state : STATE_CODES.keySet()) {
            seedStateDetail(state);
            seedEnsembleHistogramME(state);
            seedEnsembleSplits(state);
            seedEnsembleSummary(state);
            seedImpactThresholdTable(state);
            seedEIAnalysis(state);
            seedBoxWhiskerME(state);
            seedBoxWhisker(state);
            seedGingles(state);
        }
    }

    public void seedStateDetail(String state) throws Exception {
        if (alreadySeeded("state-detail", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "state_detail")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, StateDetail.class));
        System.out.println("Migration: Successfully seeded StateDetail for " + state);
    }


    public void seedEnsembleHistogramME(String state) throws Exception {
       if (alreadySeeded("ensemble-histogram-me", state)) {
            System.out.println("Migration: Ensemble Histogram ME already populated. Skipping.");
            return;
        }

        InputStream inputStream = new ClassPathResource(jsonPath(state, "ensemble_histogram_me")).getInputStream();
        JsonNode root = mapper.readTree(inputStream);

        int totalDistricts = root.get("totalDistricts").asInt();

        Map<Integer, EnsembleHistogramME.GroupCounts> raceBlind = parseGroupCounts(root.get("raceBlind"));
        Map<Integer, EnsembleHistogramME.GroupCounts> vra = parseGroupCounts(root.get("vra"));

        EnsembleHistogramME histogram = new EnsembleHistogramME(state, totalDistricts, raceBlind, vra);
        mongoTemplate.save(histogram);
        System.out.println("Migration: Successfully seeded EnsembleHistogramME for " + state);
    }

    public void seedEnsembleSplits(String state) throws Exception {
        if (alreadySeeded("ensemble-splits", state)) {
            System.out.println("Migration: Ensemble Splits already populated. Skipping.");
            return;
        }

        InputStream inputStream = new ClassPathResource(jsonPath(state, "ensemble_splits")).getInputStream();
        JsonNode root = mapper.readTree(inputStream);

        int totalDistricts = root.get("totalDistricts").asInt();

        Map<Integer, EnsembleSplits.Splits> raceBlind = parseSplits(root.get("raceBlind"));
        Map<Integer, EnsembleSplits.Splits> vra = parseSplits(root.get("vra"));

        EnsembleSplits splits = new EnsembleSplits(state, totalDistricts, raceBlind, vra);
        mongoTemplate.save(splits);
        System.out.println("Migration: Successfully seeded EnsembleSplits for " + state);
    }


    public void seedGingles(String state) throws Exception {
        if (alreadySeeded("gingles", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "gingles_results")).getInputStream());

        Map<Race, Map<Party, Gingles.RegressionFit>> fits = new HashMap<>();
        root.get("regression").get("fits").properties().forEach(e -> {
            Race race = Race.fromValue(e.getKey());
            Map<Party, Gingles.RegressionFit> partyMap = new HashMap<>();
            e.getValue().forEach(n -> {
                String candidateName = n.get("candidate").asText();
                Party party = candidateName.equals("harris") ? Party.DEMOCRAT : Party.REPUBLICAN;
                Gingles.RegressionFit fit = mapper.convertValue(n, Gingles.RegressionFit.class);
                partyMap.put(party, fit);
            });
            fits.put(race, partyMap);
        });

        Set<Gingles.Precinct> precincts = new HashSet<>();
        root.get("precincts").forEach(n -> precincts.add(mapper.convertValue(n, Gingles.Precinct.class)));

        mongoTemplate.save(new Gingles(root.get("state").asText(), new Gingles.Regression(fits), precincts));
        System.out.println("Migration: Successfully seeded Gingles for " + state);
    }

    public void seedEIAnalysis(String state) throws Exception {
        if (alreadySeeded("ei-analysis", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "ei_models")).getInputStream());

        Map<Party, EIAnalysis.Candidate> candidates = new HashMap<>();
        root.get("candidates").forEach(n -> {
            EIAnalysis.Candidate c = mapper.convertValue(n, EIAnalysis.Candidate.class);
            String id = c.getId();
            Party party = id.equals("harris") ? Party.DEMOCRAT : Party.REPUBLICAN;
            candidates.put(party, c);
        });

        EIAnalysis analysis = new EIAnalysis(root.get("state").asText(), candidates);
        mongoTemplate.save(analysis);

        System.out.println("Migration: Successfully seeded EIAnalysis for " + state);
    }

    public void seedImpactThresholdTable(String state) throws Exception {
        if (alreadySeeded("impact-threshold-table", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "impact_threshold_table")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, ImpactThresholdTable.class));
        System.out.println("Migration: Successfully seeded ImpactThreshold for " + state);
    }

    public void seedEnsembleSummary(String state) throws Exception {
        if (alreadySeeded("ensemble-summary", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "ensemble_summary")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, EnsembleSummary.class));
        System.out.println("Migration: Successfully seeded EnsembleSummary for " + state);
    }

    public void seedBoxWhiskerME(String state) throws Exception {
        if (alreadySeeded("box-whisker-plots-me", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "box_whisker_me")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, BoxWhiskerPlotsME.class));
        System.out.println("Migration: Successfully seeded BoxWhiskerME for " + state);
    }

    public void seedBoxWhisker(String state) throws Exception {
        if (alreadySeeded("box-whisker-plots", state)) return;
        JsonNode root = mapper.readTree(new ClassPathResource(jsonPath(state, "box_whisker")).getInputStream());
        mongoTemplate.save(mapper.convertValue(root, BoxWhiskerPlots.class));
        System.out.println("Migration: Successfully seeded BoxWhisker for " + state);
    }

    /* helpers --------------------------------------------------------- */

    private Map<Integer, EnsembleHistogramME.GroupCounts> parseGroupCounts(JsonNode node) {
        Map<Integer, EnsembleHistogramME.GroupCounts> result = new HashMap<>();
        node.properties().forEach(entry -> {
            int district = Integer.parseInt(entry.getKey());
            JsonNode counts = entry.getValue();
            Map<Race, Integer> raceCounts = new HashMap<>();
            counts.properties().forEach(r -> raceCounts.put(Race.valueOf(r.getKey().toUpperCase()), r.getValue().asInt()));
            result.put(district, new EnsembleHistogramME.GroupCounts(raceCounts));
        });
        return result;
    }

    private Map<Integer, EnsembleSplits.Splits> parseSplits(JsonNode node) {
        Map<Integer, EnsembleSplits.Splits> result = new HashMap<>();
        node.properties().forEach(entry -> {
            int district = Integer.parseInt(entry.getKey());
            JsonNode splitsNode = entry.getValue();
            int total = splitsNode.has("total") ? splitsNode.get("total").asInt() : 0;
            Map<Race, Integer> raceSplits = new HashMap<>();
            splitsNode.properties().forEach(r -> {
                if (!r.getKey().equals("total")) {
                    raceSplits.put(Race.valueOf(r.getKey().toUpperCase()), r.getValue().asInt());
                }
            });
            result.put(district, new EnsembleSplits.Splits(total, raceSplits));
        });
        return result;
    }

    private boolean alreadySeeded(String collection, String state) {
        return mongoTemplate.exists(
            Query.query(Criteria.where("state").is(state)), 
            collection
        );
    }
}