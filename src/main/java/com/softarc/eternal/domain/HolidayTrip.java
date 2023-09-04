package com.softarc.eternal.domain;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HolidayTrip {

  private Long id;
  private Instant fromDate;
  private Instant toDate;
  private BigDecimal priceSingleRoom;
  private BigDecimal priceDoubleRoom;
  private String currency;
  private Long holidayId;
  private Long guideId;
}
