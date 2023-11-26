package com.softarc.eternal.holiday.domain;

import lombok.Builder;

@Builder
public record Guide(
  Long id,
  String firstname,
  String lastname,
  String email,
  String phoneNr,
  String bio
) {}
