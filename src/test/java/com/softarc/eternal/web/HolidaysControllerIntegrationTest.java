package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.request.HolidayDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest()
@ActiveProfiles("test")
@AutoConfigureMockMvc
class HolidaysControllerIntegrationTest {

  @Autowired
  HolidaysController controller;

  @Autowired
  HolidaysRepository repository;

  @Autowired
  WebTestClient webTestClient;

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidaysRepository.class);
  }

  @Test
  public void testAddHoliday() throws Exception {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "Netherlands");
    webTestClient
      .post()
      .uri("/api/holidays")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holidays")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam");
  }

  @Test
  public void testAddHolidayIsValidated() {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "");
    webTestClient
      .post()
      .uri("/api/holidays")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isBadRequest();
  }
}
