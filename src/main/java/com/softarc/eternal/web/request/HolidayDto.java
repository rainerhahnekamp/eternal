package com.softarc.eternal.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HolidayDto(
  Long id,
  @NotNull @NotBlank String name,
  @NotNull @NotBlank String description
) {}
