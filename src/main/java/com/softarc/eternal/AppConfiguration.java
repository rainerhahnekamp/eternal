package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.FsHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.data.OverlappingCalculator;
import com.softarc.eternal.domain.Holiday;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

  @Bean
  public HolidaysRepository getHolidaysRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties,
    OverlappingCalculator calculator
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidaysRepository(
        objectMapper,
        appProperties.getPersistenceFile()
      );
    } else {
      List<Holiday> holidays;
      if (appProperties.isPreSeed()) {
        holidays =
          Arrays.asList(
            new Holiday(
              1L,
              "Canada",
              "Visit Rocky Mountains",
              Optional.empty(),
              Collections.emptySet()
            ),
            new Holiday(
              2L,
              "China",
              "To the Middle Kingdom",
              Optional.empty(),
              Collections.emptySet()
            )
          );
      } else {
        holidays = Collections.emptyList();
      }
      return new DefaultHolidaysRepository(holidays, calculator);
    }
  }
}
