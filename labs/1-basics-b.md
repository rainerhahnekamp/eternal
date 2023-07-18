- [1. Advanced Dependency Injection](#1-advanced-dependency-injection)
  - [1.1. Configuration](#11-configuration)
  - [1.2. Interface](#12-interface)
  - [1.3. Multiple Implementations](#13-multiple-implementations)
- [2. Conditional Beans and Configuration](#2-conditional-beans-and-configuration)
  - [2.1. Properties via `@Value()`](#21-properties-via-value)
  - [2.2. Properties via `ConfigurationProperties()`](#22-properties-via-configurationproperties)
- [3. Setup Logging](#3-setup-logging)
  - [3.1. Logging \& Profiles](#31-logging--profiles)
  - [3.2. Logging to file and console](#32-logging-to-file-and-console)
  - [3.3. Profile-based logging](#33-profile-based-logging)
  - [3.4. Profile-based Repository via `@Profile`](#34-profile-based-repository-via-profile)
  - [3.5. Profile-based Repository via Configuration](#35-profile-based-repository-via-configuration)
- [4. Bonus: Enable Automatic Restart](#4-bonus-enable-automatic-restart)

The solution branch for the whole lab is `solution-1-2-advanced`.

# 1. Advanced Dependency Injection

## 1.1. Configuration

Remove `@Service` from `HolidaysRepository` and register it as Spring Bean via a new class `com.softarc.eternal.AppConfiguration`. Make use of the annotations `@Configuration` and `@Bean`.

<details>
<summary>Show Solution</summary>
<p>

**AppConfiguration.java**

```java
@Configuration
public class AppConfiguration {

  @Bean
  public HolidaysRepository getHolidaysRepository() {
    return new HolidaysRepository();
  }
}

```

</p>
</details>

## 1.2. Interface

Extract the `HolidayService` into an interface. The interface should become the Bean and name of the original implementation should become `DefaultHolidaysRepository`.

Make sure, that `HolidaysController` does not inject the `DefaultHolidaysRepository` but the `HolidayService`.

**Hint:** If you use IntelliJ, try out the action _Extract to Interface..._

<details>
<summary>Show Solution</summary>
<p>

**HolidaysRepository.java**

```java
public interface HolidaysRepository {
  List<Holiday> findAll();

  void add(String name);

  Optional<Holiday> find(Long id);

  void remove(Long id);
}

```

**DefaultHolidaysRepository.java**

```java
public class DefaultHolidaysRepository implements HolidaysRepository {
  // original implementation
}

```

</p>
</details>

## 1.3. Multiple Implementations

Create another implementation of `FsHolidaysRepository` which persists and loads the holidays to and from the filesystem. Use `holidays.json` as filename.

In order to persist Java objects to JSON format, you can inject the service `ObjectMapper` which comes with Spring Boot pre-configured.

Example code to read and write data:

```java
File file = Paths.get("holidays.json").toFile();

// write
this.objectMapper.writeValue(this.file, this.holidays);

//read
this.holidays = new ArrayList<>(Arrays.asList(
  this.objectMapper.readValue(file, Holiday[].class)
));
```

Don't forget to update the `AppConfiguration` as well.

<details>
<summary>Show Solution</summary>
<p>

**FsHolidaysRepository.java**

```java
package com.softarc.eternal.data;

// imports ...

public class FsHolidaysRepository implements HolidaysRepository {

  private final ObjectMapper objectMapper;
  private final List<Holiday> holidays;

  private Long currentId;
  private final File file = Paths.get("holidays.json").toFile();

  @SneakyThrows
  public FsHolidaysRepository(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;

    if (!this.file.exists()) {
      this.holidays = new ArrayList<>();
      this.init();
    } else {
      this.holidays =
        new ArrayList<>(
          Arrays.asList(this.objectMapper.readValue(this.file, Holiday[].class))
        );

      this.currentId = getCurrentId();
    }
  }

  private Long getCurrentId() {
    return this.holidays.stream()
      .map(Holiday::getId)
      .max(Long::compareTo)
      .orElse(0L);
  }

  private void init() {
    this.holidays.clear();
    holidays.add(new Holiday(1L, "Canada", "Visit Rocky Mountains"));
    holidays.add(new Holiday(2L, "China", "To the Middle Kingdom"));
    this.currentId = this.getCurrentId();
    this.persist();
  }

  @SneakyThrows
  private void persist() {
    this.objectMapper.writeValue(this.file, this.holidays);
  }

  @Override
  public List<Holiday> findAll() {
    return this.holidays;
  }

  @Override
  public void add(String name) {
    this.holidays.add(new Holiday(++this.currentId, name, "-"));
    this.persist();
  }

  @Override
  public Optional<Holiday> find(Long id) {
    for (Holiday holiday : this.holidays) {
      if (holiday.getId().equals(id)) {
        return Optional.of(holiday);
      }
    }

    return Optional.empty();
  }

  @Override
  public void remove(Long id) {
    this.find(id)
      .ifPresentOrElse(
        holiday -> {
          this.holidays.remove(holiday);
          this.persist();
        },
        () -> {
          throw new RuntimeException(
            String.format("could not find Holiday with id %d", id)
          );
        }
      );
  }
}

```

</p>
</details>

# 2. Conditional Beans and Configuration

We want to define which `HolidaysRepository` should be used and also the filename for the `FsHolidayRepository`.

Add the following properties to the file **/src/main/resources/application.yml**:

```yml
app.holidays:
  persistence-type: file
  persistence-file: holidays.json
```

## 2.1. Properties via `@Value()`

Spring should inject `app.holidays.persistence-type` into the `AppConfiguration`. When the value is `file`, it should instantiate `FsHolidaysRepository`, otherwise `DefaultHolidaysRepository`.

`FsHolidaysRepository` should inject the `app.holidays.persistence-file` instead of statically using "holidays.json".

Use the `@Value` annotation in both cases.

<details>
<summary>Show Solution</summary>
<p>

**AppConfiguration.java**

```java
@Configuration
public class AppConfiguration {

  @Value("${app.holidays.persistence-type}")
  private String persistenceType;

  @Value("${app.holidays.persistence-file}")
  private String persistenceFile;

  @Bean
  public HolidaysRepository getHolidaysRepository(ObjectMapper objectMapper) {
    if ("file".equals(this.persistenceType)) {
      return new FsHolidaysRepository(objectMapper, persistenceFile);
    } else {
      return new DefaultHolidaysRepository();
    }
  }
}

```

**FsHolidaysRepository.java**

```java
public class FsHolidaysRepository implements HolidaysRepository {

  // ...

  private final File file; // <-- no initialisation

  public FsHolidaysRepository(ObjectMapper objectMapper, String filename) {
    this.objectMapper = objectMapper;
    this.file = Paths.get(filename).toFile(); // <-- initialisation
    // ...
  }
  // ...
}

```

</p>
</details>

## 2.2. Properties via `ConfigurationProperties()`

Instead of using the unsafe `@Value`, create a new class `AppProperties` which uses `@ConfigurationProperties("app.holidays")` instead. That class should be injected in `AppConfiguration` and `FsHolidaysRepository`.

Add another annotation processor to your dependencies array in **build.gradle**:

```groovy
dependencies {
  // ...
  annotationProcessor "org.springframework.boot:spring-boot-configuration-processor"
}
```

<details>
<summary>Show Solution</summary>
<p>

**AppProperties.java**

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties("app.holidays")
@Configuration
@Data
public class AppProperties {

  private String persistenceType;
  private String persistenceFile;
}

```

**AppConfiguration.java**

```java
@Configuration
public class AppConfiguration {

  @Bean
  public HolidaysRepository getHolidaysRepository(
    ObjectMapper objectMapper,
    AppProperties appProperties
  ) {
    if ("file".equals(appProperties.getPersistenceType())) {
      return new FsHolidaysRepository(
        objectMapper,
        appProperties.getPersistenceFile()
      );
    } else {
      return new DefaultHolidaysRepository();
    }
  }
}

```

</p>
</details>

# 3. Setup Logging

Add logging statements to your implementation of the `HolidaysRepository`. For example, when a new holiday is added, it should log "Holiday [holidayName] was added".

## 3.1. Logging & Profiles

Use the `@Log` annotation of Lombok. Inside of your methods, you can very easily log via the static `log` method.

For example:

```java
FsHolidaysRepository.log.info(String.format("Holiday %s was added.", name));
```

## 3.2. Logging to file and console

Next, we want to change the behaviour. We want too see our application's log in the console, and the rest should end up in a file.

In the directory **/src/main/resources**, add the file **logback.xml**. Restart the application and verify, that a logging was created and contains already logging data.

**logback.xml**

```xml
<configuration>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%-5level %logger{35} - %msg %n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>application.log</file>
        <append>true</append>
        <encoder>
            <pattern>%-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="FILE"/>
    </root>

    <logger name="com.softarc.eternal" level="info">
        <appender-ref ref="STDOUT"/>
    </logger>

</configuration>
```

## 3.3. Profile-based logging

We want to have a different logging behaviour dependening in which context our application currently runs.

During development, all logging should be done in the console and only during production, we want to have our **application.log**.

To achieve this,

1. Rename **logback.xml** to **logback-stage.xml**.
2. Delete the existing **application.log**.
3. Start Spring, and verify that no log file is created.
4. Restart Spring, via
   1. Linux/Mac:
      - `SPRING_PROFILES_ACTIVE=stage ./gradlew clean bootRun`
   2. Windows:
      - `SET SPRING_PROFILES_ACTIVE=test`
      - `gradle clean bootRun`

This time, an **application.log** should be generated.

Restart Spring in the default mode (no setting of environment variables).

## 3.4. Profile-based Repository via `@Profile`

Let's apply profiles to Beans as well. We want that profile "demo" uses the `DefaultHolidaysRepository` and otherwise we want to have the `FsHolidaysRepository`.

Update the `AppConfiguration` via the `@Profile` annotation.

## 3.5. Profile-based Repository via Configuration

An alternative to `@Profile` is to delegate to "configuration profile files". Add a new **application-demo.yml** in the **resources** directory and set the property `app.holidays.persistence-type` to "default".

# 4. Bonus: Enable Automatic Restart

In IntelliJ, you have to enable two options, to trigger an automatic restart of Spring when you modify your code.

1. In "Advanced Settings", enable the checkbox "Allow auto-make to start even if developed application is currently running".
2. In "Build, Execution, Deployment" >> "Compiler", enable the checkbox "Build project automatically".
