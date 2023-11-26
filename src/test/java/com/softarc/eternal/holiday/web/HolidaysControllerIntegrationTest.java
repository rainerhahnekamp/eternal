package com.softarc.eternal.holiday.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest()
@ActiveProfiles("test")
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
  public void testAddHoliday() {
    controller.add( "Amsterdam");
    var holiday = repository.findAll().stream().filter(h -> "Amsterdam".equals(h.name())).findFirst().orElseThrow();
    assertThat(controller.find(holiday.id())).isEqualTo(holiday);
  }
  }
