package com.softarc.eternal.holiday.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.HolidayMother;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class HolidaysControllerUnitTest {

  @Autowired
  HolidayController controller;

  @MockBean
  HolidayRepository repository;

  @Test
  public void testRepositoryIsCalled() {
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");
    controller.add(vienna);
    verify(repository).add("Vienna", "Urlaub in Wien");
  }

  @Test
  public void testMockRepository() {
    var holiday = HolidayMother.vienna().build();
    when(repository.findAll()).thenReturn(Collections.singletonList(holiday));
    assertThat(controller.index())
      .isEqualTo(
        Collections.singletonList(
          new HolidayResponse(
            holiday.getId(),
            holiday.getName(),
            holiday.getDescription()
          )
        )
      );
  }
}
