package com.softarc.eternal;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MySQLContainer;

@TestConfiguration
public class TestApplicationConfiguration {
  @Bean
  @ServiceConnection
  MySQLContainer<?> getMySqlContainer() {
    return new MySQLContainer<>("mysql:8.0.30");
  }
}
