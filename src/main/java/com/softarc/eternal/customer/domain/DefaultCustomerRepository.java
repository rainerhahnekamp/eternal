package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Customer;
import com.softarc.eternal.customer.domain.dto.AddCustomer;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.java.Log;

@Log
public class DefaultCustomerRepository implements CustomerRepository {
  private DummyService dummyService;
  private Boolean showGdpr;
  private List<Customer> customers = new ArrayList<Customer>();
  private Long currentId = 0L;

  public DefaultCustomerRepository(Boolean showGdpr, DummyService dummyService) {
    this.showGdpr = showGdpr;
    this.dummyService = dummyService;

    this.add(new AddCustomer("Max", "Mustermann"));
    this.add(new AddCustomer("Anna", "Schneider"));
    this.add(new AddCustomer("Konrad", "Schmidt"));
    this.add(new AddCustomer("Samantha", "Taylor"));
  }

  @Override
  public List<Customer> findAll() {
    log.info("Returning Customers");
    return customers.stream().filter(customer -> !this.showGdpr || customer.hasGdpr()).toList();
  }

  @Override
  public Customer add(@Valid AddCustomer addCustomer) {
    var customer =
        new Customer(
            ++this.currentId, addCustomer.firstname(), addCustomer.name(), true, Instant.now());
    this.customers.add(customer);
    return customer;
  }

  @Override
  public Customer findById(Long id) {
    for (Customer customer : this.customers) {
      if (customer.id().equals(id)) {
        return customer;
      }
    }

    throw new RuntimeException("ID cannot be found");
  }

  @Override
  public Long count() {
    return null;
  }
}
