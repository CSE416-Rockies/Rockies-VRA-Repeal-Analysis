package com.rockies.vra_analysis.converters;

import com.rockies.vra_analysis.models.Race;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Component;

@Component
@ReadingConverter
public class RaceReadingConverter implements Converter<String, Race> {

    @Override
    public Race convert(String source) {
        return Race.fromValue(source);
    }
}