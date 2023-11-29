package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import com.softarc.eternal.customer.domain.dto.AddCustomer;
import java.util.List;

public interface Customers {
  List<Customer> findAll();

  Customer findById(Long id);

  Customer add(AddCustomer addCustomer);

  Long count();
}
