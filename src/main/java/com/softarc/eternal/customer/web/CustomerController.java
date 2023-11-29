package com.softarc.eternal.customer.web;

import com.softarc.eternal.common.IdNotFoundException;
import com.softarc.eternal.customer.domain.CustomerAdder;
import com.softarc.eternal.customer.domain.CustomerRepository;
import com.softarc.eternal.customer.web.exception.CustomerException;
import com.softarc.eternal.customer.web.mapping.CustomerMapper;
import com.softarc.eternal.customer.web.request.AddCustomerRequest;
import com.softarc.eternal.customer.web.request.EditCustomerRequest;
import com.softarc.eternal.customer.web.response.CustomerDto;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.java.Log;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@Log
public class CustomerController {
  private final CustomerMapper customerMapper;
  private final CustomerRepository repository;
  private final CustomerAdder customerAdder;

  public CustomerController(
      CustomerMapper customerMapper,
      CustomerRepository customerRepository,
      CustomerAdder customerAdder) {
    this.customerMapper = customerMapper;
    this.repository = customerRepository;
    this.customerAdder = customerAdder;
  }

  @GetMapping()
  public List<CustomerDto> findAll() {
    log.info("findAll called");
    return repository.findAll().stream().map(customerMapper::toCustomerDto).toList();
  }

  @GetMapping("/{id}")
  public CustomerDto index(@PathVariable Long id) {
    if (id == 0) {
      //      throw new RuntimeException("ID cannot be 0");

      throw new CustomerException();
    }

    return this.customerMapper.toCustomerDto(
        repository.findById(id).orElseThrow(IdNotFoundException::new));
  }

  @PostMapping()
  public CustomerDto add(@RequestBody @Valid AddCustomerRequest addCustomerRequest) {
    var customer =
        customerAdder.add(
            addCustomerRequest.firstName(),
            addCustomerRequest.lastName(),
            addCustomerRequest.countryName());
    return this.customerMapper.toCustomerDto(customer);
  }

  @PutMapping("")
  public CustomerDto add(@RequestBody @Valid EditCustomerRequest editCustomerRequest) {
    var entity = repository.findById(editCustomerRequest.id()).orElseThrow(IdNotFoundException::new);
    entity.setFirstname(editCustomerRequest.firstname());
    return this.customerMapper.toCustomerDto(repository.save(entity));
  }

  @DeleteMapping("{id}")
  @CacheEvict(value = "customers", allEntries = true)
  public void removeAll() {}
}
