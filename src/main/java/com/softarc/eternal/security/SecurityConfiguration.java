package com.softarc.eternal.security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors()
      .configurationSource(request -> {
        var cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:4200"));
        cors.setAllowedMethods(
          List.of("GET", "POST", "OPTIONS", "PUT", "DELETE")
        );
        cors.setAllowedHeaders(List.of("*"));
        cors.setAllowCredentials(true);

        return cors;
      })
      .and()
      .authorizeHttpRequests(authorize -> {
        try {
          authorize
            .anyRequest()
            .authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt()
            .jwtAuthenticationConverter(
              new KeycloakJwtAuthenticationConverter()
            );
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });
    return http.build();
  }
}
