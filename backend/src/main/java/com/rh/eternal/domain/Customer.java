package com.rh.eternal.domain;

import lombok.Data;

import java.time.Instant;

@Data
public class Customer {
  private Long id;

  private String firstname;
  private String name;
  private String country;
  private Instant birthdate;
}
