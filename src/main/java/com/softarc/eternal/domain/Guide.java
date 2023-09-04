package com.softarc.eternal.domain;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Guide {

  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String phoneNr;
  private String text;
}
