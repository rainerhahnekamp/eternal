package com.softarc.eternal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.FsHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class AppConfiguration {

  @Bean @Profile("default")
  public HolidayRepository getFsHolidayRepository(
      ObjectMapper objectMapper, AppProperties appProperties) {
    return new FsHolidayRepository(objectMapper, appProperties.getPersistenceFile());
  }

  @Bean @Profile({"demo", "test"})
  public HolidayRepository getDefaultHolidayRepository() {
    return new DefaultHolidayRepository();
  }
}
