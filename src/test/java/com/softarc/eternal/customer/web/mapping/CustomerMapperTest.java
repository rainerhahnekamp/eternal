package com.softarc.eternal.customer.web.mapping;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.softarc.eternal.customer.domain.dto.AddCustomer;
import com.softarc.eternal.customer.web.request.AddCustomerRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest()
class CustomerMapperTest {

  @Autowired CustomerMapper mapper;

  @Test
  void toAddCustomer() {
    var dto = new AddCustomerRequest("Konrad", "Schmidt");
    assertThat(mapper.toAddCustomer(dto))
        .usingRecursiveComparison()
        .isEqualTo(new AddCustomer("Konrad", "Schmidt"));
  }
}
