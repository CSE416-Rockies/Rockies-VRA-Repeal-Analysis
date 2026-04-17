package com.rockies.vra_analysis;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import com.rockies.vra_analysis.converters.RaceReadingConverter;


@Configuration
public class MongoConfig {
    
    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(List.of(new RaceReadingConverter()));
    }
}