package com.softarc.eternal.customer.data;

import java.time.Instant;

public class CustomerMother {
  private static Long currentId = 0L;

  public static Customer.CustomerBuilder konrad() {
    return Customer.builder()
        .id(++CustomerMother.currentId)
        .firstname("Konrad")
        .name("Huber")
        .hasGdpr(true).createdAt(Instant.now());

  }
}
