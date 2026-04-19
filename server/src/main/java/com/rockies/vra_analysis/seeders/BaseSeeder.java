package com.rockies.vra_analysis.seeders;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Component
public abstract class BaseSeeder {

    protected final MongoTemplate mongoTemplate;
    protected final ObjectMapper mapper;

    protected static final Map<String, String> STATE_CODES = Map.of(
        "Arkansas", "ar",
        "Georgia", "ga"
    );

    public BaseSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        this.mongoTemplate = mongoTemplate;
        this.mapper = mapper;
    }

    // e.g: ga_ei_models.json
    protected String jsonPath(String state, String filename){
        return "data/" + state + "/" + STATE_CODES.get(state) + "_" + filename + ".json"; 
    }

    protected boolean alreadySeeded(String collection, String state){
        return mongoTemplate.exists(
            Query.query(Criteria.where("state").is(state)),
            collection
        );
    }
}