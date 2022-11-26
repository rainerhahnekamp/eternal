package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.multipart.MultipartFile;

@WebMvcTest(HolidaysController.class)
public class HolidaysControllerUnitTest {

  @Autowired
  HolidaysController controller;

  @MockBean
  HolidaysRepository repository;

  @Test
  public void testRepositoryIsCalled() throws IOException {
    MultipartFile cover = mock(MultipartFile.class);
    when(cover.getOriginalFilename()).thenReturn("vienna.jpg");
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    controller.add(vienna, cover);
    verify(repository)
      .add("Vienna", "Urlaub in Wien", Optional.of("vienna.jpg"));
  }

  @Test
  public void testCoverFileIsMovedToStorage() throws IOException {
    MultipartFile cover = mock(MultipartFile.class);
    when(cover.getOriginalFilename()).thenReturn("vienna.jpg");
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    controller.add(vienna, cover);
    verify(cover).transferTo(Path.of("", "filestore", "vienna.jpg"));
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
            holiday.getDescription(),
            Collections.emptyList()
          )
        )
      );
  }
}
