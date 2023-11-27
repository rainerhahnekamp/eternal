package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.java.Log;

@Log
public class DefaultCustomerRepository implements CustomerRepository {
  private DummyService dummyService;
  private Boolean showGdpr;

  public DefaultCustomerRepository(Boolean showGdpr, DummyService dummyService) {
    this.showGdpr = showGdpr;
    this.dummyService = dummyService;
  }

  @Override
  public List<Customer> findAll() {
    var customers = new ArrayList<Customer>();
    var max = new Customer(1L, "Max", "Mustermann", true);
    var anna = new Customer(2L, "Anna", "Schneider", false);

    customers.add(max);
    customers.add(anna);

    log.info("Returning Customers");

    return customers.stream().filter(customer -> !this.showGdpr || customer.hasGdpr()).toList();
  }
}
