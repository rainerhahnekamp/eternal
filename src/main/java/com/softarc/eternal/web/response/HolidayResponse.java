package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;

public record HolidayResponse(
  @NotNull Long id,
  @NotNull String name,
  @NotNull String description
) {}
