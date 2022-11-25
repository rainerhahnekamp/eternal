package com.softarc.eternal.web.response;

import com.softarc.eternal.domain.HolidayTrip;
import java.util.Set;

public record HolidayResponse(
  Long id,
  String name,
  String description,
  Boolean hasCover,
  Set<HolidayTrip> holidayTrips
) {}
