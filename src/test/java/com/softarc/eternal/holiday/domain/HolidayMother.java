package com.softarc.eternal.holiday.domain;

import java.util.ArrayList;
import java.util.Optional;

public class HolidayMother {

  private static Long id = 1L;

  public static Holiday.HolidayBuilder vienna() {
    return Holiday.builder()
        .id(++HolidayMother.id)
        .name("Vienna")
        .coverPath(Optional.empty())
        .description("This is a default description")
        .trips(new ArrayList<>());
  }
}
