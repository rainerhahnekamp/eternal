package com.softarc.eternal.holiday.domain;

import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Holiday {
  private Long id;
  private String name;
  private String description;
  private Optional<String> coverPath;
  private List<HolidayTrip> trips;
}
