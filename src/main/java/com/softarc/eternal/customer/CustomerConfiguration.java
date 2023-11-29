package com.softarc.eternal.customer;

import com.softarc.eternal.customer.domain.Customers;
import com.softarc.eternal.customer.domain.DefaultCustomers;
import com.softarc.eternal.customer.domain.DummyService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class CustomerConfiguration {
  @Bean
  Customers getCustomerRepository(
      CustomerProperties customerProperties, DummyService dummyService) {
    return new DefaultCustomers(customerProperties.getShowGdpr(), dummyService);
  }

  @Bean
  DummyService getDummyService() {
    return new DummyService();
  }
}
