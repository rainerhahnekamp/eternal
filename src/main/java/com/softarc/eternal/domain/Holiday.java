package com.softarc.eternal.domain;

import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Holiday {

  private Long id;

  private String name;

  private String description;

  @Builder.Default
  private Set<HolidayTrip> trips = new HashSet<>();
}
