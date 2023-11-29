package com.softarc.eternal.holiday.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Guide {

  @Id
  private Long id;

  private String firstname;
  private String lastname;
  private String email;
  private String phoneNr;
  private String bio;
}
