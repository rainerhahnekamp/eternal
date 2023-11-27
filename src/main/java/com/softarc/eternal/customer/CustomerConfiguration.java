package com.softarc.eternal.customer;

import com.softarc.eternal.customer.domain.CustomerRepository;
import com.softarc.eternal.customer.domain.DefaultCustomerRepository;
import com.softarc.eternal.customer.domain.DummyService;
import com.softarc.eternal.customer.domain.TestCustomerRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration(proxyBeanMethods = false)
public class CustomerConfiguration {
  @Bean @Profile("default")
  CustomerRepository getCustomerRepository(
      CustomerProperties customerProperties, DummyService dummyService) {
    return new DefaultCustomerRepository(customerProperties.getShowGdpr(), dummyService);
  }

  @Bean @Profile({"test", "demo"})
  CustomerRepository getCustomerRepositoryForTest() {
    return new TestCustomerRepository();
  }

  @Bean
  DummyService getDummyService() {
    return new DummyService();
  }
}
