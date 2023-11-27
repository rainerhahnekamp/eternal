package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import java.util.Collections;
import java.util.List;

public class TestCustomerRepository implements CustomerRepository {
  @Override
  public List<Customer> findAll() {
    return Collections.emptyList();
  }
}
