package com.softarc.eternal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import jakarta.persistence.*;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
