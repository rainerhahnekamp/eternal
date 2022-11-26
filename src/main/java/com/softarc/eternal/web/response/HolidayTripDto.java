package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record HolidayTripDto(
  @NotNull Long id,
  @NotNull Instant fromDate,
  @NotNull Instant toDate
) {}
