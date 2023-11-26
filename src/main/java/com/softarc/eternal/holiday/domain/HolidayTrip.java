package com.softarc.eternal.holiday.domain;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;

@Builder
public record HolidayTrip(
  Long id,
  Instant fromDate,
  Instant toDate,
  BigDecimal priceSingleRoom,
  BigDecimal priceDoubleRoom,
  String currency,
  Long holidayId,
  Long guideId
) {}
