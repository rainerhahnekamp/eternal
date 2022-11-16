package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.FsHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

  @Bean
  public HolidaysRepository getHolidaysRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidaysRepository(
        objectMapper,
        appProperties.getPersistenceFile()
      );
    } else {
      var holidays = Arrays.asList(
        new Holiday(
          1L,
          "Canada",
          "Visit Rocky Mountains",
          Collections.emptySet()
        ),
        new Holiday(
          2L,
          "China",
          "To the Middle Kingdom",
          Collections.emptySet()
        )
      );
      return new DefaultHolidaysRepository(holidays);
    }
  }
}
