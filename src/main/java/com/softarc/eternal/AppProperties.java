package com.softarc.eternal;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties("app.holidays")
@Configuration
@Data
public class AppProperties {

  private String persistenceType;
  private String persistenceFile;
}
