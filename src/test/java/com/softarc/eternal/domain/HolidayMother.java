package com.softarc.eternal.domain;

import java.util.Optional;

public class HolidayMother extends Holiday {

  private static Long id = 1L;

  public static HolidayBuilder vienna() {
    return Holiday
      .builder()
      .id(++HolidayMother.id)
      .name("Vienna")
      .coverPath(Optional.empty())
      .description("This is a default description");
  }
}
