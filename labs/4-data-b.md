- [1. Spring Data Testing](#1-spring-data-testing)
- [2. Relations](#2-relations)
- [3. Flyway \& MySQL](#3-flyway--mysql)
  - [3.1. Setup](#31-setup)
  - [3.2. Flyway](#32-flyway)
    - [3.2.1. Dependencies](#321-dependencies)
    - [3.2.2. Migration Script](#322-migration-script)
    - [3.2.3. Configuration](#323-configuration)
    - [3.2.4. Verification](#324-verification)
- [4. Further Exercises](#4-further-exercises)

# 1. Spring Data Testing

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

# 2. Relations

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

# 3. Flyway & MySQL

Enough of having a single-access model. We'll switch to MySQL ;).

## 3.1. Setup

We use Docker to run MySQL. Create a new composer file:

**/docker-compose.yml**

```yml
version: '3.9'

services:
  db:
    image: mysql:8.0.30
    ports:
      - 3306:3306
    environment:
      - MYSQL_ROOT_PASSWORD=eternal
      - MYSQL_DATABASE=eternal
      - MYSQL_USER=eternal
      - MYSQL_PASSWORD=eternal123
    volumes:
      - db_data:/var/lib/mysql
      - db_logs:/var/log/mysql
      - db_config:/etc/mysql/mysql.conf.d

volumes:
  db_data:
  db_config:
  db_logs:
```

Start the MySQL directly from IntelliJ or run it in the console via `docker compose up -d`.

Make sure you can connect to it via IntelliJ's database view. The username is _eternal_ and the password _eternal123_. The JDBC Url is _jdbc:mysql://localhost:3306/eternal_.

Register the MySQL connector by adding the a dependency in `build.gradle`.

**build.gradle**

```groovy
dependencies {
  // ...

  implementation 'mysql:mysql-connector-java:8.0.32'
}
```

## 3.2. Flyway

In order to manage the development of our database schema, we use Flyway. It generates script files for every DDL operation.

### 3.2.1. Dependencies

First, register the required dependencies.

**build.gradle**

```groovy
dependencies {
  // ...

  implementation 'org.flywaydb:flyway-core'
  implementation 'org.flywaydb:flyway-mysql'
}
```

### 3.2.2. Migration Script

Let's create a first migration script.

**/src/main/resource/db/migration/V1\_\_init.sql**

```sql
create table holiday
(
  id          int auto_increment primary key,
  name        nvarchar(50) not null,
  description text         not null,
  cover_path  text         null
);

create table guide
(
  id        int auto_increment primary key,
  firstname nvarchar(50) not null,
  lastname  nvarchar(50) not null,
  email     nvarchar(50) not null,
  phone_nr  nvarchar(50) not null,
  bio       text         not null
);

create table holiday_trip
(
  id                int auto_increment primary key,
  from_date         timestamp,
  to_date           timestamp,
  price_single_room decimal(7, 2),
  price_double_room decimal(7, 2),
  currency          nvarchar(3),
  holiday_id        int references holiday (id),
  guide_id          int references guide (id)
);

```

### 3.2.3. Configuration

Next, replace H2 with MySQL in our config.

**application.yml**

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/eternal
```

Remove any other `spring.datasource` you have from H2.

### 3.2.4. Verification

- Now restart Spring and you should see in the logs that the migration ran.
- Connect to the MySQL instance and verify our three tables are there. There should also be a `flyway_schema_history` as well.
- You might want to run the **dml.sql** to fill in some demo data.
- Open your app, create, edit and delete a holiday.

# 4. Further Exercises

- Holidays as API: You can see the entity layer as a module of its own. The controllers don't have access to it. Instead, there should be a `Holidays` class, acting as facade and provides all the necessary functions. That would also include `addTrip` and `assignGuide`.
- Differentiation between Domain and Entity classes: Kind of what we did with DTOs, but this time the DTOs are also used internally for logic. For example assigning guides or adding a trip. In that case, the `@Entity` classes would only be used for persistence and the logic is done in the domain classes.
- To Map between classes, use the library MapStruct.
- Sometimes you need to map a value from your database to another one. Can be from a `varchar` to `Instant` or `int` to an `enum`. In that case, we have converteres that are registered on the entity class.
- Spring Data supports querying for paged lists and sorting. You can add paging and sorting to your frontend table and adapt the backend for it.
- Use Spring Data's support for asynchronous queries via `@Future`.
- Jooq: For complex queries, you'll hit a limit with Spring Data. You can use `@Query` but have to provide a string which is not really safe. The library Jooq allows you to write typesafe SQL.
- Come up with multiple sql commands that need to be executed within a transaction. Use `@Transactional` for that.
- Naming Strategies: You might have noticed that the DDL for MySQL is different. You can register you own strategy how Hibernate resolve the column and table names from the `@Entity` classes.
