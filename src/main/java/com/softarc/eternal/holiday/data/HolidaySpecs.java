package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Holiday;
import org.springframework.data.jpa.domain.Specification;

public class HolidaySpecs {

  public static Specification<Holiday> isJpgCover() {
    return (
      (root, query, builder) -> builder.like(root.get("coverPath"), "%jpg")
    );
  }
}
