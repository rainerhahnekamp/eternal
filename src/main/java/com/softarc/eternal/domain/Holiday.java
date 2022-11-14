package com.softarc.eternal.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Holiday {

  private Long id;
  private String name;
  private String description;
}
