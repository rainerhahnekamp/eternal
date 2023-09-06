package com.softarc.eternal.web.response;

import com.softarc.eternal.domain.HolidayTrip;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record HolidayResponse(
  @NotNull Long id,
  @NotNull String name,
  @NotNull String description,
  @NotNull List<HolidayTrip> holidayTrips
) {}
