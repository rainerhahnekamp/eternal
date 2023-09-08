package com.softarc.eternal.web.request;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record HolidayDto(
  Long id,
  @NotBlank String name,
  @NotBlank String description,
  List<HolidayTripDto> trips
) {}
