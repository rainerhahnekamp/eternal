package com.softarc.eternal.holiday.web.request;

import jakarta.validation.constraints.NotBlank;

public record HolidayDto(Long id, @NotBlank String name, @NotBlank String description) {}