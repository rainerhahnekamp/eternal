package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import java.util.List;

public interface CustomerRepository {
  List<Customer> findAll();

  void add(String name);

  Long count();
}
