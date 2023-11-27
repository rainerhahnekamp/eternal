package com.softarc.eternal.holiday.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.holiday.data.DefaultHolidayRepository;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.web.request.HolidayDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest()
@ActiveProfiles("test")
@AutoConfigureMockMvc
class HolidayControllerIntegrationTest {

  private static final Path destinationPath = Path.of(
    "",
    "filestore",
    "vienna.jpg"
  );

  @Autowired
  HolidayController controller;

  @Autowired
  HolidayRepository repository;

  @BeforeEach
  void removeViennaFile() throws IOException {
    if (Files.exists(destinationPath)) {
      Files.delete(destinationPath);
    }
  }

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidayRepository.class);
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
    var amsterdam = new HolidayDto(1L, "Amsterdam", "Netherlands");
    builder.part("holidayDto", amsterdam);

    webTestClient
      .post()
      .uri("/api/holiday")
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .bodyValue(builder.build())
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holiday")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam")
      .jsonPath("[0].hasCover")
      .isEqualTo(true);

    assertThat(Files.exists(destinationPath)).isTrue();
  }
}
