package com.rh.eternal.web.response;

import lombok.Data;

@Data
public class SignUpResponse {
  private final Long userId;
  private final String activationCode;
  private final String activationToken;
}
