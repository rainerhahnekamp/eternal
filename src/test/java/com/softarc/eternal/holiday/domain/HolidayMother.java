package com.softarc.eternal.holiday.domain;

import java.util.ArrayList;

public class HolidayMother  {

  private static Long id = 1L;

  public static Holiday.HolidayBuilder vienna() {
    return Holiday
      .builder()
      .id(++HolidayMother.id)
      .name("Vienna")
      .coverPath(null)
      .version(1L)
      .trips(new ArrayList<>())
      .description("This is a default description");
  }
}
