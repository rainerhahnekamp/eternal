package com.softarc.eternal.customer;

import com.softarc.eternal.customer.domain.CustomerRepository;
import com.softarc.eternal.customer.domain.DefaultCustomerRepository;
import com.softarc.eternal.customer.domain.DummyService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class CustomerConfiguration {
  @Bean
  CustomerRepository getCustomerRepository(
      CustomerProperties customerProperties, DummyService dummyService) {
    return new DefaultCustomerRepository(customerProperties.getShowGdpr(), dummyService);
  }

  @Bean
  DummyService getDummyService() {
    return new DummyService();
  }
}
