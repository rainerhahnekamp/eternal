package com.softarc.eternal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

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
  private Long id;

  private Instant fromDate;
  private Instant toDate;
  private BigDecimal priceSingleRoom;
  private BigDecimal priceDoubleRoom;
  private String currency;
  private Long holidayId;
  private Long guideId;
}
