package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.data.DefaultHolidays;
import com.softarc.eternal.data.FsHolidays;
import com.softarc.eternal.data.Holidays;
import com.softarc.eternal.data.OverlappingCalculator;
import com.softarc.eternal.domain.Holiday;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

  @Bean
  public Holidays getHolidaysRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties,
    OverlappingCalculator calculator
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidays(objectMapper, appProperties.getPersistenceFile());
    } else {
      List<Holiday> holidays;
      if (appProperties.isPreSeed()) {
        holidays =
          Arrays.asList(
            new Holiday(
              1L,
              "Canada",
              "Visit Rocky Mountains",
              null,
              1L,
              Collections.emptyList(),
              null
            ),
            new Holiday(
              2L,
              "China",
              "To the Middle Kingdom",
              null,
              1L,
              Collections.emptyList(),
              null
            )
          );
      } else {
        holidays = Collections.emptyList();
      }
      return new DefaultHolidays(holidays, calculator);
    }
  }
}
