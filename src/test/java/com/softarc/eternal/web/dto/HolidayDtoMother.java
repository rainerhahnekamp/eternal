package com.softarc.eternal.web.dto;

import com.softarc.eternal.web.request.HolidayDto;


public class HolidayDtoMother {
  private static Long id = 1L;

  public static HolidayDto.HolidayDtoBuilder vienna() {
    return HolidayDto.builder().id(++HolidayDtoMother.id).name("Vienna").description("Holiday in Wien");

  }
}
