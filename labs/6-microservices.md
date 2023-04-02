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

Install Spring Cloud and replace the WebClient with an OpenFeign client. Enable it in **Application.java** by adding `@EnableFeignClients`.

<details>
<summary>Show Solution</summary>
<p>

Setup Spring Cloud first

**build.gradle**

```groovy
// add this property
ext {
  set('springCloudVersion', "2022.0.2")
}

dependencies {
  // ...
  implementation 'org.springframework.cloud:spring-cloud-starter-openfeign' // <- add this
}

// add the property for dependency management
dependencyManagement {
  imports {
    mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
  }
}


```

Create a Feign-enabled `PrintingClient`

**PrintingClient.java**

```java
package com.softarc.eternal.remote.printing;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "printing", url = "http://localhost:8081")
public interface PrintingClient {
  @PostMapping(value = "/api/order")
  boolean addPrintingJob(AddPrintingJobRequest addPrintingJobRequest);
}

```

Update the `AddPrintingJob` so that it uses the newly created `PrintingClient`.

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

  private final PrintingClient printingClient;

  public AddPrintingJob(PrintingClient printingClient) {
    this.printingClient = printingClient;
  }

  public BrochureStatus add(Holiday holiday) {
    try {
      this.printingClient.addPrintingJob(
          new AddPrintingJobRequest(
            holiday.getId(),
            holiday.getName(),
            holiday.getDescription()
          )
        );
      return BrochureStatus.CONFIRMED;
    } catch (Exception e) {
      return BrochureStatus.FAILED;
    }
  }
}

```

</p>
</details>

# Message Broker

Let's assume, we can send the print request to our printing service, but it could take a very long time until the printing-service is finished.

Keep the request as it is, but set the `brochureStatus` to `requested`.

The printing service has with `POST http://localhost:8081/api/order/printed/{id}` and endpoint, that has to be triggered, when a print is done. It sends a message to RabbitMQ with the following details:

- exchange: `printing-events`
- routerKey: `printing.routing`

Setup a queue along a receiver that consumes that message and sets the holiday to the status `printed`.

<details>
<summary>Show Solution</summary>
<p>

**build.gradle**

```groovy
dependencies {
  // ...
  implementation 'org.springframework.boot:spring-boot-starter-amqp' // <- add this
}

```

Setup a `PrintedJobReceiver`, which receives the messages from RabbitMQ and changes the `brochureStatus` of that particular holiday.

Then configure the queue for RabbitMQ

**PrintedJobReceiver.java**

```java
package com.softarc.eternal.remote.printing;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.BrochureStatus;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

@Service
@Log
public class PrintedJobReceiver {

  private final HolidaysRepository holidaysRepository;

  PrintedJobReceiver(HolidaysRepository holidaysRepository) {
    this.holidaysRepository = holidaysRepository;
  }

  public void processMessage(String message) {
    Long holidayId = Long.parseLong(message);
    this.holidaysRepository.findById(holidayId)
      .ifPresentOrElse(
        holiday -> {
          holiday.setBrochureStatus(BrochureStatus.PRINTED);
          this.holidaysRepository.save(holiday);
        },
        () -> {
          log.warning("Could not find Holiday with ID " + holidayId);
        }
      );
  }
}

```

Last, setup the RabbitMQ configuration.

**MessagingConfiguration.java**

```java
package com.softarc.eternal.messaging;

import com.softarc.eternal.remote.printing.PrintedJobReceiver;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessagingConfiguration {

  public static final String exchangeName = "printing-events";
  public static final String queueName = "printing-events-queue";
  public static final String routingKey = "printing.routing";

  @Bean
  Queue getQueue() {
    return new Queue(queueName, false);
  }

  @Bean
  TopicExchange getExchange() {
    return new TopicExchange(exchangeName);
  }

  @Bean
  Binding getBinding(Queue queue, TopicExchange exchange) {
    return BindingBuilder.bind(queue).to(exchange).with(routingKey);
  }

  @Bean
  MessageListenerAdapter listenerAdapter(
    PrintedJobReceiver printedJobReceiver
  ) {
    return new MessageListenerAdapter(printedJobReceiver, "processMessage");
  }

  @Bean
  SimpleMessageListenerContainer getContainer(
    ConnectionFactory connectionFactory,
    MessageListenerAdapter listenerAdapter
  ) {
    SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
    container.setConnectionFactory(connectionFactory);
    container.setQueueNames(queueName);
    container.setMessageListener(listenerAdapter);

    return container;
  }
}

```

</p>
</details>
