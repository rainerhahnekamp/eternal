package com.softarc.eternal.domain;

public class HolidayMother extends Holiday {

  private static Long id = 1L;

  public static HolidayBuilder vienna() {
    return Holiday
      .builder()
      .id(++HolidayMother.id)
      .name("Vienna")
      .description("This is a default description");
  }
}
