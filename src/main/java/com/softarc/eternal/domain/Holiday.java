package com.softarc.eternal.domain;

import java.util.ArrayList;
import java.util.List
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
  private List<HolidayTrip> trips = new ArrayList<>();
}
