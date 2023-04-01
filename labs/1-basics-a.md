- [1. Create Domain Classes with Lombok support](#1-create-domain-classes-with-lombok-support)
- [2. Holidays Controller](#2-holidays-controller)
- [3. `HolidaysRepository`](#3-holidaysrepository)
  - [3.1. Implementation](#31-implementation)
  - [3.2. Native Usage in `HolidaysController`](#32-native-usage-in-holidayscontroller)
- [4. Beans \& Dependency Injection](#4-beans--dependency-injection)
- [5. Connecting the Frontend](#5-connecting-the-frontend)

The solution branch for the whole lab is `solution-1-1-basics`.

# 1. Create Domain Classes with Lombok support

Create a new class `Holiday` under the package `com.softarc.eternal`. It should have the following properties:

- `Long id`
- `String name`
- `String description`

We do not generate the getters, setters and constructors on our own but use Lombok.

Register the dependencies for lombok in **build.gradle**. You have to add following entries under `dependencies`:

```groovy
dependences {
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

It might also be necessary to instrument your IDE that it should use annotation processing.

In IntelliJ, the setting is at _Build, Execution, Deployment_ >> _Compiler_ >> _Annotation Processors_. Just click on _Enable annotation processing_.

<details>
<summary>Show Solution</summary>
<p>

```java
package com.softarc.eternal.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Holiday {

  private Long id;
  private String name;
  private String description;
}

```

</p>
</details>

# 2. Holidays Controller

Our application acts as backend, so we will need a Controller which processes HTTP requests against certain URLs.

Enable Spring Web MVC by installing the starter.

Add `implementation 'org.springframework.boot:spring-boot-starter-web` to the `dependencies` property in **build.gradle**.

Create a new class `HolidaysController`. It should be located in the package `com.softarc.eternal.web`. Annotate the class as a `RestController` and assign the Url `/api/holidays` to it.

It should return a list of holidays. You can use these as an example or create your one ones:

```java
List<Holiday> holidays = new ArrayList<>();
this.holidays.add(new Holiday(1L, "Canada", "Visit Rocky Mountains"));
this.holidays.add(new Holiday(2L, "China", "To the Middle Kingdom"));
return holidays;
```

Verify, that _http://localhost:8080/api/holidays_ returns the generated holidays.

<details>
<summary>Show Solution</summary>
<p>

```java
@RestController
@RequestMapping("/api/holidays")
public class HolidaysController {

  @GetMapping
  public List<Holiday> findAll() {
    List<Holiday> holidays = new ArrayList<>();
    holidays.add(new Holiday(1L, "Canada", "Visit Rocky Mountains"));
    holidays.add(new Holiday(2L, "China", "To the Middle Kingdom"));
    return holidays;
  }
}

```

</p>
</details>

# 3. `HolidaysRepository`

## 3.1. Implementation

In the package `com.softarc.eternal.data`, create the class `HolidaysRepository`, which has a private property `List<Holiday>` and provides CRUD methods:

- `List<Holiday> findAll();`
- `Optional<Holiday> find(Long id);`
- `void add(String name);`
- `void remove(Long id);`

You can use following pre-defined holidays:

```java
new Holiday(1L, "Canada", "Visit Rocky Mountains");
new Holiday(2L, "China", "To the Middle Kingdom");
```

<details>
<summary>Show Solution</summary>
<p>

```java
public class HolidaysRepository {

  private final List<Holiday> holidays = new ArrayList<>();
  private Long currentId = 3L;

  public HolidaysRepository() {
    this.holidays.add(new Holiday(1L, "Canada", "Visit Rocky Mountains"));
    this.holidays.add(new Holiday(2L, "China", "To the Middle Kingdom"));
  }

  public List<Holiday> findAll() {
    return this.holidays;
  }

  public void add(String name) {
    var holiday = new Holiday(this.currentId++, name, "-");
    this.holidays.add(holiday);
  }

  public Optional<Holiday> find(Long id) {
    for (Holiday holiday : this.holidays) {
      if (holiday.getId().equals(id)) {
        return Optional.of(holiday);
      }
    }

    return Optional.empty();
  }

  public void remove(Long id) {
    this.holidays.removeIf(holiday -> holiday.getId().equals(id));
  }
}

```

</p>
</details>

## 3.2. Native Usage in `HolidaysController`

`HolidaysController` should create a new instance of the `HolidaysRepository` in its constructor.

Extend the `HolidaysController`, so that it provides the full CRUD functionality of the `HolidaysRepository`:

- **GET, /api/holidays**: returns all holidays
- **GET, /api/holidays/{id}**: returns holiday for the passed id or throws an error
- **POST, /api/holidays/{name}**: adds a new holiday with the passed name
- **DELETE, /api/holidays/{id}**: removes the holiday with that particular id

<details>
<summary>Show Solution</summary>
<p>

```java
@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  private final HolidaysRepository repository;

  HolidaysController() {
    this.repository = new HolidaysRepository();
  }

  @GetMapping
  public List<Holiday> index() {
    return this.repository.findAll();
  }

  @GetMapping("{id}")
  public Holiday find(@PathVariable("id") Long id) {
    return this.repository.find(id).orElseThrow();
  }

  @PostMapping("{name}")
  public void add(@PathVariable("name") String name) {
    this.repository.add(name);
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}

```

</p>
</details>

# 4. Beans & Dependency Injection

We don't want to instantiate the dependencies, like `HolidaysRepository`, manually. Make a bean out of `HolidaysRepository` and let Spring inject it into the `HolidaysController`.

<details>
<summary>Show Solution</summary>
<p>

**HolidaysRepository.java**

```java
@Service // <-- add this
public class HolidaysRepository {}
// ...

```

**HolidaysController.java**

```java
// ...
public class HolidaysController {

  private final HolidaysRepository repository;

  // new controller
  HolidaysController(HolidaysRepository repository) {
    this.repository = repository;
  }
  // ...
}

```

</p>
</details>

# 5. Connecting the Frontend

Our frontend should be able to connect to our backend. Since both are running on different origins, we have to setup a proper CORS Configuration.

Create a new class `WebConfig` and copy the following content into it (explanation follows later).

**WebConfig.java**

```java
package com.softarc.eternal;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
          .addMapping("/api/**")
          .allowedOrigins("http://localhost:4200")
          .allowedMethods("GET", "POST", "OPTIONS", "PUT", "DELETE")
          .allowCredentials(true);
      }
    };
  }
}
```

Now modify the `HolidaysRepository` in Angular so that it connects to the newly created API. At the moment, we can't edit a holiday, so that feature has to be skipped.

Verify you can add a new holiday and that it is persisted (after a page reload).

<details>
<summary>Show Solution</summary>
<p>

**/libs/admin/holidays/data/src/lib/holidays-repository.service.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class HolidaysRepository {
  #holidays$ = new BehaviorSubject<Holiday[]>([]);
  #httpClient = inject(HttpClient);
  #initialized = false;

  get holidays$(): Observable<Holiday[]> {
    if (!this.#initialized) {
      this.#update();
      this.#initialized = true;
    }
    return this.#holidays$.asObservable();
  }

  findById(id: number): Observable<Holiday | undefined> {
    return this.#httpClient.get<Holiday | undefined>(`/holidays/${id}`);
  }

  async save(holiday: Holiday) {
    throw new Error('not implemented');
  }

  async add(holiday: Holiday): Promise<void> {
    await firstValueFrom(
      this.#httpClient.post<void>(`/holidays/${holiday.name}`, {})
    );
    await this.#update();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.#httpClient.delete(`/holidays/${id}`));
    await this.#update();
  }

  async #update() {
    const holidays = await firstValueFrom(
      this.#httpClient.get<Holiday[]>('/holidays')
    );
    this.#holidays$.next(holidays);
  }
}
```

</p>
</details>

