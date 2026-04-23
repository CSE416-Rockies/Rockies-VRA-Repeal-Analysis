package com.rockies.vra_analysis.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Component;

import com.rockies.vra_analysis.enums.Race;

@Component
@ReadingConverter
public class RaceReadingConverter implements Converter<String, Race> {

    @Override
    public Race convert(String source) {
        return Race.fromValue(source);
    }
}