package com.softarc.eternal.customer.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class CustomerTest {

  @Test
  void getFullname() {
    var customer = CustomerMother.konrad().name("Schmidt").build();
    assertThat(customer.getFullname()).startsWith("Schmidt");
  }
}
