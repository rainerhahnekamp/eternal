package com.softarc.eternal.holiday.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Guide {
  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String phoneNr;
  private String bio;
  }
