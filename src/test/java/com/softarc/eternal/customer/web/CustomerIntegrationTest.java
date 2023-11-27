package com.softarc.eternal.customer.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.softarc.eternal.customer.data.CustomerMother;
import com.softarc.eternal.customer.domain.CustomerRepository;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class CustomerIntegrationTest {
  @Autowired CustomerController controller;

  @MockBean CustomerRepository customerRepository;

  @Test
  public void testInit() {}

  @Test
  public void testFindAll() throws InterruptedException {
    var konrad = CustomerMother.konrad().build();
    Thread.sleep(1);
    var expectedKonrad = CustomerMother.konrad().build();
    when(customerRepository.findAll()).thenReturn(Collections.singletonList(konrad));
    assertThat(controller.findAll())
        .usingRecursiveFieldByFieldElementComparatorIgnoringFields("createdAt", "id")
        .containsOnly(expectedKonrad);
  }
}
