package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Country;
import com.softarc.eternal.customer.data.Customer;
import java.time.Instant;
import java.util.Collections;
import org.springframework.stereotype.Service;

@Service
public class CustomerAdder {
  private final CustomerRepository customerRepository;
  private final CountryRepository countryRepository;

  public CustomerAdder(CustomerRepository customerRepository, CountryRepository countryRepository) {
    this.customerRepository = customerRepository;
    this.countryRepository = countryRepository;
  }

  public Customer add(String firstname, String name, String countryName) {
    var optCountry = countryRepository.findFirstByName(countryName);
    Country country =
        optCountry.orElseGet(
            () -> {
              var newCountry = new Country(null, countryName, Collections.emptyList());
              return countryRepository.save(newCountry);
            });

    var customer = new Customer(null, firstname, name, true, Instant.now(), country);
    return customerRepository.save(customer);
  }
}
