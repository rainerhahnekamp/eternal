package com.softarc.eternal;

import org.springframework.boot.SpringApplication;

public class TestApplication {
  public static void main(String[] args) {
    SpringApplication.from(Application::main).with(TestApplicationConfiguration.class).run(args);
  }
}
