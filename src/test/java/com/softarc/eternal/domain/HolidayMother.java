package com.softarc.eternal.domain;

import java.util.ArrayList;
import java.util.Collections;

public class HolidayMother extends Holiday {

  private static Long id = 1L;

  public static HolidayBuilder vienna() {
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
