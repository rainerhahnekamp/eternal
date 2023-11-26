package com.softarc.eternal.data;

import java.time.LocalDate;

record OverlappingParameter(
  LocalDate start1,
  int durationInDays1,
  LocalDate start2,
  int durationInDays2,
  boolean isOverlapping
) {}
