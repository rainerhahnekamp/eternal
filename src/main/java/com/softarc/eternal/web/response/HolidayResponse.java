package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HolidayResponse(
  @NotNull Long id,
  @NotBlank String name,
  @NotBlank String description,
  @NotNull Boolean hasCover
) {}
