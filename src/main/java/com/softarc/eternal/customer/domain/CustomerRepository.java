package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
  List<Customer> findAll();
}
