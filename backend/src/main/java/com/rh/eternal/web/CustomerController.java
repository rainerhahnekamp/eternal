package com.rh.eternal.web;

import com.rh.eternal.db.entity.CustomerEntity;
import com.rh.eternal.db.mapper.CustomerMapper;
import com.rh.eternal.db.repository.CustomerRepository;
import com.rh.eternal.domain.Customer;
import com.rh.eternal.web.response.CustomerPage;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController()
@RequestMapping("customer")
@Log4j2
public class CustomerController {
  private final CustomerRepository repository;
  private final CustomerMapper mapper;

  public CustomerController(CustomerRepository repository) {
    this.repository = repository;
    this.mapper = CustomerMapper.INSTANCE;
  }

  @GetMapping()
  public CustomerPage findAll(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer pageSize) {
    CustomerPage customerPage = new CustomerPage();

    Page<CustomerEntity> customerEntityPage =
        this.repository.findAll(PageRequest.of(page, pageSize));
    customerPage.setTotalPages(customerEntityPage.getTotalPages());
    customerPage.setContent(
        customerEntityPage.getContent().stream()
            .map(mapper::mapFromEntity)
            .collect(Collectors.toList()));
    return customerPage;
  }

  @PostMapping("")
  public Customer add(@RequestBody Customer customer) {
    return mapper.mapFromEntity(this.repository.save(mapper.mapToEntity(customer)));
  }

  @PutMapping("")
  public Customer edit(@RequestBody Customer customer) {
    return this.repository
        .findById(customer.getId())
        .map(
            entity -> {
              mapper.merge(mapper.mapToEntity(customer), entity);
              return mapper.mapFromEntity(this.repository.save(entity));
            })
        .orElseThrow(
            () -> new RuntimeException("Customer with ID " + customer.getId() + " does not exist"));
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable("id") Long customerId) {
    this.repository.deleteById(customerId);
  }
}
