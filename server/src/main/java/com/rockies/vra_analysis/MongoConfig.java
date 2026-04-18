package com.rockies.vra_analysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

import com.fasterxml.jackson.databind.ObjectMapper;


@Configuration
public class MongoConfig {
    
    // remove _class annotation **if we start mixing polymorphism, this should be removed**
    @Autowired
    public void configureTypeMapper(MappingMongoConverter converter) {
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
    }
    
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}