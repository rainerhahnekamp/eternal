package com.softarc.eternal.holiday.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Guide {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String firstname;
  private String lastname;
  private String email;
  private String phoneNr;
  private String bio;

  @OneToMany
  private Set<HolidayTrip> holidayTrips;

  @ManyToMany(mappedBy = "guides")
  private List<Holiday> holidays;
}
