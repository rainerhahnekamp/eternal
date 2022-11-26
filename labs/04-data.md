# H2

## Setup

Setup an embedded database we can use for development purposes.

In IntelliJ, open the database window, click on _New_ (plus symbol) and select H2 from the available databases.

In _URL_ type in the following JDBC URL "jdbc:h2:./dev-db".

Also make sure that the drivers are available. IntelliJ will shows a link "Download missing drivers". Click on it, if it is shown.

Click on "Test Connection" to make sure IntelliJ can connect to the database.

If everything ran successfully, you should see new two files in your project's root folder:

- **deb-db.mv.db**
- **dev-db.trace.db**

In order to run the web console, add the following two dependencies to your **build.gradle**

```kotlin
implementation 'com.h2database:h2'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

Start Spring and navigate to _http://localhost:8080/h2-console_. You should see the H2 Console where you can try to connect. Make sure you use the right path.

## Create the Tables and Insert Data

Close Spring, open the database view in IntelliJ again, click the "plus" symbol and open the "Query Console".

Insert the SQL to create the tables for `Holiday`, `HolidayTrip`, and `Guide`. You can try it on your own or copy it from **ddl-holidays.sql** from the **labs** directory.

Next add some holidays. Again, you can write your own SQL or copy from **dml.sql**.

To verify, that everything worked, run `select * from HOLIDAY`.

# Repository

It is time to switch from the filesystem to the database. First, a hard cut is required. Since the term `Repository` has a special meaning in Spring Data, rename `HolidaysRepository` to just `Holidays`.

**Important**: Rename it automatically. Right click on the class name, select _Refactor_ and then _Rename..._.

Once that is done create a new interface `com.softarc.eternal.data.HolidaysRepository` which extends from Spring's `JpaRepository`.

The integration tests will connect to the h2 database. In order to avoid that, add the following configuration property to the `@SpringBootTest` annotation: `spring.datasource.url=jdbc:h2:mem:application-test`.

This will not access the file-based H2 but temporarily creates one in the memory.

The major changes you will have to do:

- `coverPath` in `Holiday` changes from type `Optional<String>` to `String`.
- Methods of the new `HolidaysRepository` have slightyl different names.
- Updating the tests

<details>
<summary>Show Solution</summary>
<p>

**application.yml**

```yaml
spring:
  datasource:
    url: jdbc:h2:./dev-db
    driver-class-name: org.h2.Driver
```

**HolidaysRepository.java**

```java
package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface HolidaysRepository extends CrudRepository<Holiday, Long> {
  List<Holiday> findAll();
}

```

**Holiday.java**

```java
package com.softarc.eternal.domain;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Holiday {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  @Column(name = "COVERPATH")
  private String coverPath;

  @Builder.Default
  @Transient
  private Set<HolidayTrip> trips = new HashSet<>();
}

```

**HolidaysController.java**

For the changes in the controller, please checkout the diff from branch **solution-4-data-2-entity**.

</p>
</details>

# Spring Data Testing

Write 4 tests that use an in-memory database against the `HolidaysRepository`:

Tip: If you want to see the values of your SQL statements, add the following to your **application.yml**:

```yml
logging:
  level:
    org.hibernate.orm.jdbc.bind: trace
```

1. `testFindAll`: Should add and persist a holiday and retrieve it via `findAll`.
2. `testCrud`: Should add, persist, find, update and then remove a holiday. This is a test with multiple assertions.
3. `testNonExistingHoliday`: Should verify, that an empty Optional is returned when a non-existend holiday is search for.
4. Validations: Should verify that the validation annotations on `Holiday::name` works:
   1. No nulls value
   2. No empty string
   3. Minimum size of 3
   4. Only characters (regular expression would be "\\w")

<details>
<summary>Show Solution</summary>
<p>

**HolidaysRepositoryTest.java**

```java
package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.softarc.eternal.domain.HolidayMother;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class HolidaysRepositoryTest {

  @Autowired
  private HolidaysRepository repository;

  @Test
  void testFindAll() {
    var vienna = HolidayMother.vienna().build();
    repository.save(vienna);
    assertThat(repository.findAll()).hasSize(1);
  }

  @Test
  void testCrud() {
    var vienna = HolidayMother.vienna().build();
    repository.save(vienna);
    var entities = repository.findAll();
    assertThat(entities).hasSize(1);
    var entity = entities.get(0);

    assertThat(vienna).isNotEqualTo(entity);
    entity.setName("Wien");
    repository.save(entity);

    var wien = repository.findById(entity.getId()).orElseThrow();
    assertThat(wien.getName()).isEqualTo("Wien");

    repository.deleteById(wien.getId());
    assertThat(repository.findAll()).hasSize(0);
  }

  @Test
  void testNonExistingHoliday() {
    assertThat(repository.findById(1L)).isEmpty();
  }

  @Test
  void testNoBlankName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() -> repository.save(HolidayMother.vienna().name("").build())
      );
  }

  @Test
  void testNoNullOnName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name(null).build())
      );
  }

  @ParameterizedTest
  @ValueSource(strings = { "Wr. Neustadt", "District 9", "Tromsø" })
  void testOnlyCharsAndSpaceOnName(String name) {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name(name).build())
      );
  }

  @Test
  void testMinSizeOfThreeOnName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name("Ro").build())
      );
  }
}

```

</p>
</details>

# Relations

Add the relations to three entities and create the repositories for `HolidayTrip` and `Guide`.

After that, write a test, where you add a `Holiday`, a `HolidayTrip`, and a `Guide`, which all related to each other.

The test should query for the `HolidayTrip`, get the first one and verify that its properties `holiday` and `guide` exist.

Update the `HolidaysController` so that it exposes the `trips` as well. Create a `HolidayTripDto` which has the `id`, `fromDate`, and `lastDate`.

Solution branch: **solution-4-data-4-relations**

<details>
<summary>Show Solution</summary>
<p>

**Holiday.java**

```java
//...

public class Holiday {

  // ...

  @OneToMany(mappedBy = "holiday")
  private List<HolidayTrip> trips;
}

```

**Guide.java**

```java
package com.softarc.eternal.domain;

// ...

public class Guide {

  // ...

  @OneToMany
  private Set<HolidayTrip> holidayTrips;
}

```

**HolidayTrip.java**

```java
package com.softarc.eternal.domain;

public class HolidayTrip {

  // ...

  @ManyToOne
  private Holiday holiday;

  @ManyToOne
  private Guide guide;
}

```

**HolidayTripDto.java**

```java
package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record HolidayTripDto(
  @NotNull Long id,
  @NotNull Instant fromDate,
  @NotNull Instant toDate
) {}

```

**HolidayReponse.java**

```java
package com.softarc.eternal.web.response;

// ...

public record HolidayResponse(
  //...
  @NotNull List<HolidayTripDto> holidayTrips
) {}

```

**HolidayController.java**

```java
package com.softarc.eternal.web;

// ...

public class HolidaysController {

  // ...

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    var trips = holiday.getTrips().stream().map(HolidayTrip::getId).toList();
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription(),
      holiday.getCoverPath() != null,
      holiday
        .getTrips()
        .stream()
        .map(trip ->
          new HolidayTripDto(trip.getId(), trip.getFromDate(), trip.getToDate())
        )
        .collect(Collectors.toList())
    );
  }
  // ...
}

```

**DbTest.java**

```java
package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;

import com.softarc.eternal.domain.*;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
public class DbTest {

  @Autowired
  TestEntityManager entityManager;

  @Autowired
  HolidaysRepository holidaysRepository;

  @Autowired
  GuideRepository guideRepository;

  @Autowired
  HolidayTripRepository holidayTripRepository;

  Holiday vienna;
  HolidayTrip holidayTrip;
  Guide deborah;

  void setupFullHoliday() {
    var holiday = HolidayMother.vienna().build();
    this.vienna = holidaysRepository.save(holiday);

    var guide = GuideMother.deborah().build();
    this.deborah = guideRepository.save(guide);

    var trip = HolidayTripMother.start2022(vienna).guide(deborah).build();
    this.holidayTrip = holidayTripRepository.save(trip);
  }

  @Test
  void testRelationForHolidayTrip() {
    setupFullHoliday();
    var trip = holidayTripRepository.findAll().iterator().next();
    assertThat(trip.getHoliday().getName()).isEqualTo("Vienna");
    assertThat(trip.getGuide().getFirstname()).isEqualTo("Deborah");
  }
}

```

</p>
</details>

# Flyway

## MySql

## Mapping

# Mapping with MapStruct

# Converters

# Jooq

# Paging & Sorting

# Aynchronous

# Transactions and Streaming

# Holidays as Facade and specific Entity classes
