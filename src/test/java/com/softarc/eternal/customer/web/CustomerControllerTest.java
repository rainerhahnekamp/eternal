package com.softarc.eternal.customer.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.softarc.eternal.customer.data.CustomerMother;
import com.softarc.eternal.customer.domain.CustomerRepository;
import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {
  @Mock CustomerRepository repository;

  @Captor ArgumentCaptor<String> captor;

  @Test
  public void testIndexReturnsCustomers() {
    var vanessa = CustomerMother.konrad().firstname("Vanessa").build();
    var denise = CustomerMother.konrad().firstname("Denise").build();

    when(repository.findAll()).thenReturn(Arrays.asList(vanessa, denise));
    when(repository.count()).thenReturn(1L);
    var controller = new CustomerController(repository);
    var customers = controller.findAll();

    assertThat(customers).containsExactly(vanessa, denise);
    assertThat(repository.count()).isEqualTo(1L);
  }

  @Test
  public void testIndexReturnsCustomersSecond() {

    var controller = new CustomerController(repository);
    var count = repository.count();
    assertThat(count).isEqualTo(0L);
  }

  @Test
  public void testControllerCallsRepository() {
    var controller = new CustomerController(repository);
    controller.add("Schmidt");

    verify(repository).add(captor.capture());
    assertThat(captor.getValue()).isEqualTo("Schmidt");
  }
}
