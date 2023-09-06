package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record HolidayResponse(
  @NotNull Long id,
  @NotNull String name,
  @NotNull String description,
  @NotNull Boolean hasCover,
  @NotNull List<HolidayTripDto> holidayTrips
) {}
