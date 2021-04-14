package com.rh.eternal.web.request;

import lombok.Data;

@Data
public class SignInRequest {
  private String email;
  private String password;
}
