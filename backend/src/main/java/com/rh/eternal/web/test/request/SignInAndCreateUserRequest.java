package com.rh.eternal.web.test.request;

import lombok.Data;

@Data
public class SignInAndCreateUserRequest {
  private String email;
  private String password;
  private String firstname;
  private String name;
}
