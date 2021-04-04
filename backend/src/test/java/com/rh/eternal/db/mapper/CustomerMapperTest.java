package com.rh.eternal.db.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.rh.eternal.db.entity.CustomerEntity;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

class CustomerMapperTest {

  @Test
  void merge() {
    CustomerEntity customer = new CustomerEntity(1L, "John", "Doe", "AT", this.parse("2001-05-23"));
    CustomerEntity mergedCustomer = new CustomerEntity();
    mergedCustomer.setId(2L);

    CustomerMapper.INSTANCE.merge(customer, mergedCustomer);

    assertThat(mergedCustomer)
        .usingRecursiveComparison()
        .isEqualTo(new CustomerEntity(2L, "John", "Doe", "AT", this.parse("2001-05-23")));
  }

  private Instant parse(String date) {
    return LocalDate.parse(date).atStartOfDay(ZoneId.of("Europe/Vienna")).toInstant();
  }
}
