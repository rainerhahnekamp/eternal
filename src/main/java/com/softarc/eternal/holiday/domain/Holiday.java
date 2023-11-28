package com.softarc.eternal.holiday.domain;

import java.util.List;
import java.util.Optional;
import lombok.Builder;

@Builder
public record Holiday(
    Long id,
    String name,
    String description,
    Optional<String> coverPath,
    List<HolidayTrip> trips) {}
