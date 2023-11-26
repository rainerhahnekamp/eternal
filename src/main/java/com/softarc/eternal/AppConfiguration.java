package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.FsHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

  @Bean
  public HolidayRepository getHolidayRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidayRepository(
        objectMapper,
        appProperties.getPersistenceFile()
      );
    } else {
      return new DefaultHolidaRepository();
      var holidays = Arrays.asList(
        new Holiday(
          1L,
          "Canada",
          "Visit Rocky Mountains",
          Collections.emptyList()
        ),
        new Holiday(
          2L,
          "China",
          "To the Middle Kingdom",
          Collections.emptyList()
        )
      );
      return new DefaultHolidayRepository(holidays);
    }
  }
}
