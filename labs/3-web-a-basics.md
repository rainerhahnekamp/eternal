- [1. DTOs](#1-dtos)
- [2. Validated DTOs](#2-validated-dtos)
- [3. Exception Handling](#3-exception-handling)
- [4. WebTests](#4-webtests)
- [5. Further Exercises](#5-further-exercises)

The solution branch for the whole lab is `solution-3-1-basics`.

# 1. DTOs

Our `POST` or `PUT` should be able to consume parts of the `Holiday` object.

For that purpose, create a `HolidayDto` `record` which only contains `id`, `name`, `description`. `HolidaysController` is repsonsible for mapping `Holiday` to `HolidayDto`. Make sure that `name` and `description` are required.

Create another `record`, called `HolidayResponse`, which is used as type by `/api/holidays` and `/api/holidays/{id}`. As a first step, it should have the same properties as the `HolidayDto`.

Since a `PUT` request allows us to update an existing `Holiday`, add `void update(Long id, String name, String description)` to `HolidaysRepository` and implement in both classes.

<details>
<summary>Show Solution</summary>
<p>

**/src/main/java/com/softarc/eternal/web/request/HolidayDto.java**

```java
package com.softarc.eternal.web.request;

public record HolidayDto(Long id, String name, String description) {}

```

**/src/main/java/com/softarc/eternal/web/request/HolidayDto.java**

```java
package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;

public record HolidayResponse(Long id, String name, String description) {}

```

**HolidaysRepository.java**

```java
public interface HolidaysRepository {
  void add(String name, String description);

  void update(Long id, String name, String description);
}

```

The implementation for `DefaultHolidaysRepository`, `FsHolidaysRepository` and affected unit tests is skipped. I'm sure you can manage it on your own :).

**HolidaysController.java**

```java
// ...
public class HolidaysController {

  // ...

  @GetMapping
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(this::toHolidayResponse)
      .toList();
  }

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id).map(this::toHolidayResponse).orElseThrow();
  }

  @PostMapping
  public void add(@RequestBody @Valid HolidayDto holidayDto) {
    this.repository.add(holidayDto.name(), holidayDto.description());
  }

  @PutMapping
  public void update(@RequestBody @Valid HolidayDto holidayDto) {
    this.repository.update(
        holidayDto.id(),
        holidayDto.name(),
        holidayDto.description()
      );
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription()
    );
  }
}

```

**holidays-repository.service.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  // ...

  async save(holiday: Holiday) {
    await firstValueFrom(this.#httpClient.put<void>(`/holidays`, holiday));
    await this.#update();
  }

  async add(holiday: Holiday): Promise<void> {
    await firstValueFrom(this.#httpClient.post<void>(`/holidays`, holiday));
    await this.#update();
  }

  // ...
}
```

</p>
</details>

# 2. Validated DTOs

Enable BeanValidation by registering the implementation dependency in **build.gradle**

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-validation'
}
```

In `HolidayDto`, `name` and `description` must not be null or an empty string.

For `HolidayResponse`, all properties must be required, i.e. not null.

Don't forget to make sure the `HolidaysController` validates the DTOs.

<details>
<summary>Show Solution</summary>
<p>

**/src/main/java/com/softarc/eternal/web/request/HolidayDto.java**

```java
package com.softarc.eternal.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HolidayDto(
  Long id,
  @NotBlank String name,
  @NotBlank String description
) {}

```

**/src/main/java/com/softarc/eternal/web/response/HolidayResponse.java**

```java
package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;

public record HolidayResponse(
  @NotNull Long id,
  @NotNull String name,
  @NotNull String description
) {}

```

**HolidaysController.java**

```java
public class HolidaysController {

  // ...

  @PostMapping
  public void add(@RequestBody @Valid HolidayDto holidayDto) {
    // ...
  }

  @PutMapping
  public void update(@RequestBody @Valid HolidayDto holidayDto) {
    // ...
  }
  // ...
}

```

</p>
</details>

# 3. Exception Handling

When `/api/holidays/{id}` is called with an invalid id, i.e. no holiday available, return a HttpStatus code of 400 by using the `ResponseStatusException`.

<details>
<summary>Show Solution</summary>

**/src/main/java/com/softarc/eternal/web/HolidaysController.java**

```java
@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  // ...

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(this::toHolidayResponse)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
  }
}

```

</details>

---

Add an understandable explanation to the `ResponseStatusException`. Test it and make sure that the response contains the a `detail` property and the content type is `application/problem+json`.

<details>
<summary>Show Solution</summary>

**/src/main/java/com/softarc/eternal/web/HolidaysController.java**

```java
@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  // ...

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(this::toHolidayResponse)
      .orElseThrow(() ->
        new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          String.format("Holiday with ID %d does not exist", id)
        )
      );
  }
}

```

</details>

Create a new RuntimeException `IdNotFound`, and replace the throwing of the `ResponseStatusException` with an `@ControllerAdvice` which deals with `IdNotFound` exception.

<details>
<summary>Show Solution</summary>

**/src/main/java/com/softarc/eternal/web/exception/IdNotFoundException.java**

```java
package com.softarc.eternal.web.exception;

public class IdNotFoundException extends RuntimeException {}

```

**/src/main/java/com/softarc/eternal/web/HolidaysController.java**

```java
@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  // ...

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(this::toHolidayResponse)
      .orElseThrow(IdNotFoundException::new);
  }
}

```

**/src/main/java/com/softarc/eternal/web/GlobalControllerAdvice.java**

```java
@ControllerAdvice
public class GlobalControllerAdvice extends ResponseEntityExceptionHandler {

  @ExceptionHandler(IdNotFoundException.class)
  public ProblemDetail handleIdNotFound() {
    return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Wrong Id");
  }
}

```

</details>

# 4. WebTests

For these kinds of tests, we use the powerful `WebTestClient` that comes with webflux (alternative to Spring MVC). As we stick to MVC, we only need that dependency in testing. Add it to our dependencies in **build.gradle**.

Use the `WebTestClient` to test a successful `POST` request to `/api/holidays` and one that fails the validation because the `HolidayDto::description` is an empty string.

Add webflux as testImplementation to **build.gradle**

```groovy
dependencies {
  testImplementation 'org.springframework.boot:spring-boot-starter-webflux'
}
```

These kind of tests cover quite a lot. Try to come up with additional tests on your own.

<details>
<summary>Show Solution</summary>
<p>

**HolidaysControllerIntegrationTest**

```java
package com.softarc.eternal.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.data.DefaultHolidaysRepository;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.request.HolidayDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(
  properties = {
    "app.holidays.persistence-type=default", "app.holidays.pre-seed=false",
  }
)
@AutoConfigureMockMvc
class HolidaysControllerIntegrationTest {

  @Autowired
  HolidaysController controller;

  @Autowired
  HolidaysRepository repository;

  @Autowired
  WebTestClient webTestClient;

  @Test
  public void testInjectedDefaultRepository() {
    assertThat(repository).isInstanceOf(DefaultHolidaysRepository.class);
  }

  @Test
  public void testAddHoliday() throws Exception {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "Netherlands");
    webTestClient
      .post()
      .uri("/api/holidays")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isOk();
    webTestClient
      .get()
      .uri("/api/holidays")
      .exchange()
      .expectBody()
      .jsonPath("[0].name")
      .isEqualTo("Amsterdam");
  }

  @Test
  public void testAddHolidayIsValidated() {
    var amsterdam = new HolidayDto(1L, "Amsterdam", "");
    webTestClient
      .post()
      .uri("/api/holidays")
      .bodyValue(amsterdam)
      .exchange()
      .expectStatus()
      .isBadRequest();
  }
}

```

</p>
</details>

# 5. Further Exercises

- Static Serving of Files
- Filters (LoggingFilter)
- Cookies
- ResponseEntity
