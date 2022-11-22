package com.softarc.eternal.web.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HolidayDto {
  private Long id;
  private String name;
  private String description;
}
