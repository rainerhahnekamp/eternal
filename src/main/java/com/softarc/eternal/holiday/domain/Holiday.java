package com.softarc.eternal.holiday.domain;

import java.util.List;
import lombok.Builder;

@Builder
public record Holiday(Long id, String name, String description, List<HolidayTrip> trips) {}
