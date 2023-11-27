package com.softarc.eternal;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
          .addMapping("/api/**")
          .allowedOrigins("http://localhost:4200")
          .allowedMethods("GET", "POST", "OPTIONS", "PUT", "DELETE")
          .allowCredentials(true);
      }
    };
  }
}
