package com.rh.eternal.web.request;

import lombok.Data;

@Data
public class SignUpRequest {
  private String email;
  private String password;
  private String firstname;
  private String name;
}
