package com.softarc.eternal.holiday.domain;

public class GuideMother {

  static Long id = 1L;

  public static Guide.GuideBuilder deborah() {
    return Guide
      .builder()
      .id(++GuideMother.id)
      .firstname("Deborah")
      .lastname("McArthur")
      .email("deborah.mcarthur@eternal-holidays.com")
      .phoneNr("+123321")
      .bio(
        """
          Deborah visited Vancouver as a teenager and immediately fell in love
          with its landscape, culture, and people. She likes to share her passion
          for Canada with anybody who's is interested"""
      );
  }
}
