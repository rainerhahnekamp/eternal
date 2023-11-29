package com.softarc.eternal.customer.web;

import com.softarc.eternal.customer.web.request.AddCustomerRequest;
import com.softarc.eternal.customer.web.response.CustomerDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest()
@AutoConfigureMockMvc
public class CustomerIntegrationTest {
  @Autowired WebTestClient webTestClient;

  @Test
  public void testAddCustomer() {
    var request = new AddCustomerRequest("Konrad", "Schmidt");

    var response =
        webTestClient
            .post()
            .uri("/api/customer")
            .bodyValue(request)
            .exchange()
            .expectStatus()
            .isOk()
            .expectBody(CustomerDto.class)
            .returnResult();

    var id = response.getResponseBody().id();

    webTestClient
        .get()
        .uri(STR."/api/customer/\{id}")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("firstName")
        .isEqualTo("Konrad");
  }

  @Test
  public void testInvalidAddCustomer() {
    var request = new AddCustomerRequest("", "Schmidt");

    webTestClient
        .post()
        .uri("/api/customer")
        .bodyValue(request)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }
}
