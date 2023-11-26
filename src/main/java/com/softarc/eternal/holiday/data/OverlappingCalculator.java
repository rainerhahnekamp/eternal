package com.softarc.eternal.holiday.data;

import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class OverlappingCalculator {

  boolean isOverlapping(
    Instant start1,
    Instant end1,
    Instant start2,
    Instant end2
  ) {
    return start1.isBefore(end2) && start2.isBefore(end1);
  }
}
