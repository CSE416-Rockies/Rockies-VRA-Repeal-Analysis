package com.rockies.vra_analysis;

import org.springframework.boot.SpringApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class VraAnalysisApplication implements CommandLineRunner {

    @Autowired
    private MongoTemplate mongoTemplate;

    public static void main(String[] args) {
        SpringApplication.run(VraAnalysisApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            String dbName = mongoTemplate.getDb().getName();
            System.out.println("----------------------------------------------");
            System.out.println("CONNECTION SUCCESS: " + dbName);
            System.out.println("----------------------------------------------");
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
        }
    }
}