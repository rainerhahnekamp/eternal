package com.softarc.eternal.web;

import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest(properties = {"app.holidays.persistence-type=default"})
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
    controller.add( "Amsterdam");
    var holiday = repository.findAll().stream().filter(h -> "Amsterdam".equals(h.getName())).findFirst().orElseThrow();
    assertThat(controller.find(holiday.getId())).isEqualTo(holiday);
  }
  }
