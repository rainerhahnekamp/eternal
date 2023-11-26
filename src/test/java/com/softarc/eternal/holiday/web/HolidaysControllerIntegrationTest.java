package com.softarc.eternal.holiday.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.web.request.HolidayDto;
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
  HolidayController controller;

  @Autowired
  HolidayRepository repository;

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidayRepository.class);
  }

  @Test
  public void testAddHoliday(@Autowired WebTestClient webTestClient)
    throws Exception {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "Netherlands");
    webTestClient
      .post()
      .uri("/api/holiday")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holiday")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam");
  }
}
