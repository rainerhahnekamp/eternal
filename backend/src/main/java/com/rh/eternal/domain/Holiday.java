package com.rh.eternal.domain;

import lombok.Data;

@Data
public class Holiday {
  private Long id;

  private String title;
  private String teaser;
  private String description;
  private String imageUrl;
  private Long typeId;
  private Integer durationInDays;
  private Integer minCount;
  private Integer maxCount;
}
