package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.multimedia.ImageValidator;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
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

  @MockBean
  ImageValidator imageValidator;

  private MultipartFile createMultipartFile() throws IOException {
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);
    var file = mock(MultipartFile.class);
    when(file.getInputStream()).thenReturn(inputStream);
    when(file.getOriginalFilename()).thenReturn("vienna");
    when(file.getName()).thenReturn("Vienna");
    return file;
  }

  private void setImageValidatorToTrue() throws IOException {
    when(imageValidator.isFileImage(any())).thenReturn(true);
  }

  @Test
  public void testRepositoryIsCalled() throws IOException {
    MultipartFile cover = createMultipartFile();
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");
    setImageValidatorToTrue();
    controller.add(vienna, cover);
    var holiday = new Holiday(
      null,
      "Vienna",
      "Urlaub in Wien",
      "vienna",
      Collections.emptyList()
    );
    verify(repository).save(holiday);
  }

  @Test
  public void testCoverFileIsMovedToStorage() throws IOException {
    MultipartFile cover = createMultipartFile();
    setImageValidatorToTrue();
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    controller.add(vienna, cover);
    verify(cover).transferTo(Path.of("", "filestore", "vienna"));
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
            false,
            Collections.emptyList()
          )
        )
      );
  }

  @Test
  public void testImageAssertionOnSaveAndUpdate() throws IOException {
    MultipartFile file = createMultipartFile();
    var inputStream = file.getInputStream();
    setImageValidatorToTrue();
    var viennaDto = new HolidayDto(1L, "Vienna", "Urlaub in Wien");
    var vienna = HolidayMother.vienna().build();
    when(repository.findById(1L)).thenReturn(Optional.ofNullable(vienna));

    controller.add(viennaDto, file);
    verify(imageValidator).isFileImage(inputStream);
    controller.update(viennaDto, file);
    verify(imageValidator, times(2)).isFileImage(inputStream);
  }

  @Test
  public void testNonImageThrowsError() throws IOException {
    var file = createMultipartFile();
    when(imageValidator.isFileImage(any())).thenReturn(false);
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    assertThatThrownBy(() -> controller.add(vienna, file))
      .hasMessage("'Vienna' is not an image.");
  }
}
