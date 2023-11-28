package com.softarc.eternal.customer.web;

import com.softarc.eternal.customer.data.Customer;
import com.softarc.eternal.customer.domain.CustomerRepository;
import com.softarc.eternal.customer.web.exception.CustomerException;
import com.softarc.eternal.customer.web.mapping.CustomerMapper;
import com.softarc.eternal.customer.web.request.AddCustomerRequest;
import com.softarc.eternal.customer.web.response.CustomerDto;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.java.Log;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@Log
public class CustomerController {
  private final CustomerRepository repository;
  private final CustomerMapper customerMapper;

  public CustomerController(CustomerRepository repository, CustomerMapper customerMapper) {
    this.repository = repository;
    this.customerMapper = customerMapper;
  }

  @GetMapping()
  @Cacheable(value = "customer")
  public List<Customer> findAll() {
    log.info("findAll called");
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public CustomerDto index(@PathVariable Long id) {
    if (id == 0) {
      //      throw new RuntimeException("ID cannot be 0");
      throw new CustomerException();
    }

    return this.customerMapper.toCustomerDto(repository.findById(id));
  }

  @PostMapping()
  public CustomerDto add(@RequestBody @Valid AddCustomerRequest addCustomerRequest) {
    var customer =  this.repository.add(customerMapper.toAddCustomer(addCustomerRequest));

    return this.customerMapper.toCustomerDto(customer);
  }

  @DeleteMapping("{id}")
  @CacheEvict(value = "customers", allEntries = true)
  public void removeAll() {

  }
}
