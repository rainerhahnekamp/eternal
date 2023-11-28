package com.softarc.eternal.holiday.web.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record HolidayResponse(
  @NotNull Long id,
  @NotBlank String name,
  @NotBlank String description,
  @NotNull Boolean hasCover,
  @NotNull List<HolidayTripDto> holidayTrips
) {}
