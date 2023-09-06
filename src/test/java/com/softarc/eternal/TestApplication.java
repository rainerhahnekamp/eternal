package com.softarc.eternal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.testcontainers.containers.MySQLContainer;

public class TestApplication {

  public static void main(String[] args) {
    SpringApplication
      .from(Application::main)
      .with(TestApplicationConfiguration.class)
      .run(args);
  }
}
