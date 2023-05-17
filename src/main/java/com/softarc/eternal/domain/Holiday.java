package com.softarc.eternal.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Holiday {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotBlank
  @Size(min = 3)
  @Pattern(regexp = "\\w*")
  private String name;

  @NotBlank
  private String description;

  private String coverPath;

  @Version
  private Long version;

  @Builder.Default
  @OneToMany(mappedBy = "holiday")
  private List<HolidayTrip> trips = new ArrayList<>();

  @ManyToMany
  @JoinTable(
    name = "holiday_trip",
    joinColumns = @JoinColumn(name = "holiday_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(
      name = "guide_id",
      referencedColumnName = "id"
    )
  )
  public List<Guide> guides;
}
