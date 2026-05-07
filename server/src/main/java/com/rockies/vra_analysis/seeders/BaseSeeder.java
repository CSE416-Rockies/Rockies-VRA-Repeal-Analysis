package com.rockies.vra_analysis.seeders;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rockies.vra_analysis.enums.State;

@Component
public abstract class BaseSeeder {

    protected final MongoTemplate mongoTemplate;
    protected final ObjectMapper mapper;

    public BaseSeeder(MongoTemplate mongoTemplate, ObjectMapper mapper){
        this.mongoTemplate = mongoTemplate;
        this.mapper = mapper;
    }

    // e.g: ga_ei_models.json
    protected String jsonPath(State state, String filename){
        String code = state.getValue().toLowerCase();
        return "data/" + state + "/" + code + "_" + filename + ".json"; 
    }

    // e.g: ga_vra_5000.jsonl
    protected String jsonlPath(State state, String filename){
        String code = state.getValue().toLowerCase();
        return "data/" + state + "/" + code + "_" + filename + ".jsonl"; 
    }

    // e.g: rough_proportionality.json
    protected String genJsonPath( String filename){
        return "data/" + filename + ".json"; 
    }

    protected boolean alreadySeeded(String collection, State state){
        return mongoTemplate.exists(
            Query.query(Criteria.where("state").is(state.getValue())),
            collection
        );
    }
}