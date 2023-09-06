package com.softarc.eternal.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Holiday {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  private String coverPath;

  @Builder.Default
  @Transient
  private List<HolidayTrip> trips = new ArrayList<>();
}
