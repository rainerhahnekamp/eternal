package com.rh.eternal.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
  public static User anonymousUser = new User(0L, "", "", "", true);
  private Long id;
  private String email;
  private String firstname;
  private String name;
  private Boolean anonymous;
}
