package com.softarc.eternal.holiday.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

public class HolidayTripMother {

  private static Long id = 1L;

  public static HolidayTrip.HolidayTripBuilder start2022(Holiday holiday) {
    return HolidayTripMother.standard(holiday, LocalDate.of(2022, 1, 1), 7);
  }

  public static HolidayTrip.HolidayTripBuilder standard(
    Holiday holiday,
    LocalDate startDay,
    Integer durationInDays
  ) {
    var fromDate = Instant.from(startDay.atStartOfDay(ZoneOffset.UTC));
    var toDate = fromDate.plus(durationInDays, ChronoUnit.DAYS);
    return HolidayTrip
      .builder()
      .id(++HolidayTripMother.id)
      .fromDate(fromDate)
      .toDate(toDate)
      .holiday(holiday);
  }
}
