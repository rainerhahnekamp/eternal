package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.web.dto.HolidayDtoMother;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(HolidaysController.class)
public class HolidaysControllerUnitTest {

  @Autowired
  HolidaysController controller;

  @MockBean
  HolidaysRepository repository;

  @Test
  public void testRepositoryIsCalled() {

    var vienna = HolidayDtoMother.vienna().name("Vienna").description("Holiday in Wien").build();
    controller.add(vienna);
    verify(repository).add(vienna.getName(), vienna.getDescription());
  }

  @Test
  public void testMockRepository() {
    var holiday = HolidayMother.vienna().build();
    when(repository.findAll()).thenReturn(Collections.singletonList(holiday));
    assertThat(controller.index()).containsExactly(holiday);
  }
}
