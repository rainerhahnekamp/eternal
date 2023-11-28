package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.FsHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.data.OverlappingCalculator;
import com.softarc.eternal.holiday.domain.Holiday;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

  @Bean
  public HolidayRepository getHolidayRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties,
    OverlappingCalculator calculator
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidayRepository(
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
              new ArrayList<>()
            ),
            new Holiday(2L, "China", "To the Middle Kingdom", Optional.empty(), new ArrayList<>())
          );
      } else {
        holidays = Collections.emptyList();
      }
      return new DefaultHolidayRepository(holidays, calculator);
    }
  }
}
