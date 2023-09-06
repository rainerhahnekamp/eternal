package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.web.request.HolidayDto;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.AfterAll;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(
  properties = {
    "app.holidays.persistence-type=default",
    "app.holidays.pre-seed=false",
    "spring.datasource.url=jdbc:h2:mem:holidays-controller",
  }
)
@AutoConfigureMockMvc
class HolidaysControllerIntegrationTest {

  private static final Path destinationPath = Path.of(
    "",
    "filestore",
    "vienna.jpg"
  );

  @Autowired
  HolidaysController controller;

  @MockBean
  HolidaysRepository repository;

  @BeforeEach
  void removeViennaFile() throws IOException {
    if (Files.exists(destinationPath)) {
      Files.delete(destinationPath);
    }
  }

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(HolidaysRepository.class);
  }

  @Test
  public void testAddHoliday(@Autowired WebTestClient webTestClient)
    throws Exception {
    assertThat(Files.exists(destinationPath))
      .withFailMessage("Cannot start when vienna.jpg exists in filestore")
      .isFalse();
    var holidayFile = new ClassPathResource("vienna.jpg");
    MultipartBodyBuilder builder = new MultipartBodyBuilder();
    builder.part("cover", holidayFile);
    var amsterdamDto = new HolidayDto(1L, "Amsterdam", "Netherlands");
    builder.part("holidayDto", amsterdamDto);
    var amsterdam = HolidayMother
      .vienna()
      .name("Amsterdam")
      .coverPath("amsterdam.jpg")
      .build();

    when(repository.findAll()).thenReturn(Collections.singletonList(amsterdam));

    webTestClient
      .post()
      .uri("/api/holidays")
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .bodyValue(builder.build())
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holidays")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam")
      .jsonPath("[0].hasCover")
      .isEqualTo(true);

    assertThat(Files.exists(destinationPath)).isTrue();
  }
}
