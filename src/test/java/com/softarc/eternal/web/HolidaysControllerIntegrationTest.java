package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = { "app.holidays.persistence-type=default" })
//@ActiveProfiles("demo")
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
  public void testAddHoliday() {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "");
    controller.add(amsterdam);
    var holiday = repository
      .findAll()
      .stream()
      .filter(h -> "Amsterdam".equals(h.getName()))
      .findFirst()
      .orElseThrow();
    assertThat(controller.find(holiday.getId()))
      .usingRecursiveComparison()
      .ignoringFields("id")
      .isEqualTo(new HolidayResponse(1L, "Amsterdam", ""));
  }
}
