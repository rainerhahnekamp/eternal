When a new holiday is created, we want to inform our printing department to start the production of new brochures.

An API, powered by Spring Boot does already exist. It is located in the directory **/printing-service**.
Run it, and verify that it exposes an endpoint on _http://localhost:8081/api/print-brochure_.

As input, it expects a JSON structure `{holidayId: number, name: string, description: string}`.

For example in IntelliJ's services pane:

```shell
POST http://localhost:8081/api/order
Content-Type: application/json

{"id": 1, "name": "Detroit", "description": "This is a holiday in Detroit"}
```

If the `name` has the value "Graz", it will return a status code of 500.

In this lab, we communicate with the printing microservice in three different ways:

- synchronously via the `WebClient`
- synchronously via Feign
- asynchronously via RabbitMQ

# Preparation

First, add a new property `brochureStatus` to `Holiday`. It should be an enum type with following types

- none
- requested
- confirmed
- printed
- failed

Apply the `@Converter` approach to persist the `enum` and create the necessary `Flyway` migration.

If you are short on time, you can also checkout or merge from **solution-6-microservices-1-brochure-status**.

# Native WebClient

Use the `WebClient` to send an order command to the printing service when a holiday is created. `WebClient` is part of the `org.springframework.boot:spring-boot-starter-webflux` dependency. You'll have to add it to your **build.gradle**.

Create a separate service which generates the `WebClient` instance and executes the communication. You'll have to mock that one.

If the printing service returns a status code of 200, it should save the value `confirmed`, otherwise `failed`.

Update your test and include the failed use case well.

<details>
<summary>Show Solution</summary>
<p>

**build.gradle**

```groovy

dependencies {
  // ...
  implementation 'org.springframework.boot:spring-boot-starter-webflux' // <- add that one
}
```

Create the service that communicates with the printing service and returns a `BrochureStatus`

**AddPrintingJob.java**

```java
package com.softarc.eternal.remote.printing;

import com.softarc.eternal.domain.BrochureStatus;
import com.softarc.eternal.domain.Holiday;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AddPrintingJob {

  private final WebClient webClient;

  public AddPrintingJob(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl("http://localhost:8081").build();
  }

  public BrochureStatus add(Holiday holiday) {
    ResponseEntity<Void> returner = webClient
      .post()
      .uri("/api/order")
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(
        new AddPrintingJobRequest(
          holiday.getId(),
          holiday.getName(),
          holiday.getDescription()
        )
      )
      .retrieve()
      .toBodilessEntity()
      .block();

    if (returner.getStatusCode().is2xxSuccessful()) {
      return BrochureStatus.FAILED;
    } else {
      return BrochureStatus.CONFIRMED;
    }
  }
}

```

After the holiday is saved, a request should be executed. Depending on the return, the status in the `Holiday` entity has to be updated.

**HolidaysController.java**

```java
package com.softarc.eternal.web;

// imports...

public class HolidaysController {

  // ...
  private final AddPrintingJob addPrintingJob;

  public HolidaysController(
    HolidaysRepository repository,
    ImageValidator imageValidator,
    AddPrintingJob addPrintingJob // <- new dependency
  ) {
    this.repository = repository;
    this.imageValidator = imageValidator;
    this.addPrintingJob = addPrintingJob;
  }

  // ...

  public boolean add(
    @RequestPart HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    // ...
    Holiday holidayEntity = this.repository.save(holiday);
    holidayEntity.setBrochureStatus(addPrintingJob.add(holidayEntity));
    this.repository.save(holidayEntity);

    return true;
  }
}

```

Finally, you have to update your integration test and check if the failed status is set in case of a failure.

**HolidaysControllerIntegrationTest.java**

```java
package com.softarc.eternal.web;

// ...
class HolidaysControllerIntegrationTest {

  // add mocked bean and ArgumentCaptor
  @MockBean
  AddPrintingJob addPrintingJob;

  @Captor
  ArgumentCaptor<Holiday> holidayCaptor;

  @Test
  public void testAddHoliday(@Autowired WebTestClient webTestClient) {
    // mock needs to return holiday on save and printing job's behaviour needs to defined

    when(addPrintingJob.add(any(Holiday.class)))
      .thenReturn(BrochureStatus.CONFIRMED);
    when(repository.save(any(Holiday.class))).thenReturn(amsterdam);
    when(repository.findAll()).thenReturn(Collections.singletonList(amsterdam));
    // ... WebTestClient execution
  }

  // add test to verify failure
  @Test
  public void testAddHolidayWithFailedPrinting(
    @Autowired WebTestClient webTestClient
  ) throws Exception {
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

    when(addPrintingJob.add(any(Holiday.class)))
      .thenReturn(BrochureStatus.FAILED);
    when(repository.save(any(Holiday.class))).thenReturn(amsterdam);

    webTestClient
      .post()
      .uri("/api/holidays")
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .bodyValue(builder.build())
      .exchange();

    verify(repository, times(2)).save(holidayCaptor.capture());
    assertThat(holidayCaptor.getAllValues().get(1).getBrochureStatus())
      .isEqualTo(BrochureStatus.FAILED);
  }
}

```

</p>
</details>

# Feign Client

# Message Broker
