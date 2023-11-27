package com.softarc.eternal.customer.web;

import com.softarc.eternal.customer.data.Customer;
import com.softarc.eternal.customer.domain.CustomerRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
  private final CustomerRepository repository;

  public CustomerController(CustomerRepository repository) {
    this.repository = repository;
  }

  @GetMapping()
  public List<Customer> findAll() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public String index(@PathVariable Long id) {
    return "Hello from Customer with ID " + id;
  }

  @PostMapping("/{name}")
  public void add(@PathVariable String name) {
    this.repository.add(name);
  }
}
