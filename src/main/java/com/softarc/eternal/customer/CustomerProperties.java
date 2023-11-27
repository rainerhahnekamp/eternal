package com.softarc.eternal.customer;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("app.customer")
@Data
public class CustomerProperties {
  private Boolean showGdpr;
}
