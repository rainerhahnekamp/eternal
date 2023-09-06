package com.softarc.eternal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class HolidayTrip {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Instant fromDate;
  private Instant toDate;
  private BigDecimal priceSingleRoom;
  private BigDecimal priceDoubleRoom;
  private String currency;

  @ManyToOne
  private Holiday holiday;

  @ManyToOne
  private Guide guide;
}
