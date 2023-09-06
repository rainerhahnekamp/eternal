package com.softarc.eternal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
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
