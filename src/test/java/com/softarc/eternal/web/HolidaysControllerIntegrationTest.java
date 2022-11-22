package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.dto.HolidayDtoMother;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(
  properties = {
    "app.holidays.persistence-type=default", "app.holidays.pre-seed=false",
  }
)
@AutoConfigureMockMvc
class HolidaysControllerIntegrationTest {

  @Autowired
  HolidaysController controller;

  @Autowired
  HolidaysRepository repository;

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidaysRepository.class);
  }

  @Test
  public void testAddHoliday(@Autowired WebTestClient webTestClient)
    throws Exception {
    var amsterdam = HolidayDtoMother.vienna().name("Amsterdam").build();
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
}
