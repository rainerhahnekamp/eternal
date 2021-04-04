package com.rh.eternal.web;

import com.rh.eternal.db.entity.Customer;
import com.rh.eternal.db.repository.CustomerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
public class CustomerController {
  private final CustomerRepository repository;

  public CustomerController(CustomerRepository repository) {
    this.repository = repository;
  }

  @GetMapping("customer")
  public List<Customer> findAll() {
    return this.repository.findAll();
  }
}
