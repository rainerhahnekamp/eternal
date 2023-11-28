package com.softarc.eternal.holiday.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.softarc.eternal.common.ImageValidator;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.HolidayMother;
import com.softarc.eternal.holiday.web.request.HolidayDto;
import com.softarc.eternal.holiday.web.response.HolidayResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
public class HolidayControllerUnitTest {

  @Autowired
  HolidayController controller;

  @MockBean
  HolidayRepository repository;

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
    verify(repository).add("Vienna", "Urlaub in Wien", Optional.of("vienna"));
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
            holiday.id(),
            holiday.name(),
            holiday.description(),
            false
          )
        )
      );
  }

  @Test
  public void testImageAssertionOnSaveAndUpdate() throws IOException {
    MultipartFile file = createMultipartFile();
    var inputStream = file.getInputStream();
    setImageValidatorToTrue();
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    controller.add(vienna, file);
    verify(imageValidator).isFileImage(inputStream);
    controller.update(vienna, file);
    verify(imageValidator, times(2)).isFileImage(inputStream);
  }

  @Test
  public void testNonImageThrowsError() throws IOException {
    var file = createMultipartFile();
    when(imageValidator.isFileImage(any())).thenReturn(false);
    var vienna = new HolidayDto(1L, "Vienna", "Urlaub in Wien");

    assertThatThrownBy(() -> controller.add(vienna, file))
      .hasMessage("400 BAD_REQUEST \"'Vienna' is not an image.\"");
  }
}
