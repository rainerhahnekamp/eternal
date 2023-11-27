package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CustomerRepository {
  public List<Customer> findAll() {
    var customers = new ArrayList<Customer>();
    var max = new Customer(1L, "Max", "Mustermann");
    var anna = new Customer(2L, "Anna", "Schneider");
    customers.add(max);
    customers.add(anna);

    return customers;
  }

}
