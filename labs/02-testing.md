- [1. Preparation](#1-preparation)
  - [1.1. DefaultHolidaysRepository: constructor with `List<Holiday>`](#11-defaultholidaysrepository-constructor-with-listholiday)
  - [1.2. Domain Classes](#12-domain-classes)
    - [1.2.1. `Guide`](#121-guide)
    - [1.2.2. `HolidayTrip`](#122-holidaytrip)
    - [1.2.3. `Holiday`](#123-holiday)
  - [1.3. Object Mothers](#13-object-mothers)
- [2. Basic Unit Tests](#2-basic-unit-tests)
  - [2.1. `testInitialEmptyHolidays`](#21-testinitialemptyholidays)
  - [2.2. `testSettingHolidays`](#22-testsettingholidays)
  - [2.3. `testAddingHolidays`](#23-testaddingholidays)
- [3. Add `HolidayTrip`](#3-add-holidaytrip)
- [4. Add Guide with Overlapping](#4-add-guide-with-overlapping)
- [5. Add Parameterised Guide with Overlapping](#5-add-parameterised-guide-with-overlapping)
- [6. Extract Overlapping to class and mock it](#6-extract-overlapping-to-class-and-mock-it)
  - [6.1. Unit Test](#61-unit-test)
- [7. Further Exercises](#7-further-exercises)

The solution branch for the whole lab is `solution-2-1-basics`.

# 1. Preparation

**It is recommended to copy the solution of this exercise so that can quickly start with the tests.**

## 1.1. DefaultHolidaysRepository: constructor with `List<Holiday>`

The constructor of `DefaultHolidaysRepository` should have a `List<Holiday>` as parameter and should use it to set its `holidays` property. Make sure that the `AppConfiguration` passes the existing holidays to `DefaultHolidays` upon instantiation.

**DefaultHolidays.java**

```java
public class DefaultHolidaysRepository implements HolidaysRepository {

  // ...

  public DefaultHolidaysRepository(List<Holiday> holidays) {
    this.holidays.addAll(holidays);
  }
  // ...
}

```

## 1.2. Domain Classes

We add two further classes.

### 1.2.1. `Guide`

`Guide` which represents a tour guide and has the following properties:

- Long id
- String firstname
- String lastname
- String email
- String phoneNr
- String bio

### 1.2.2. `HolidayTrip`

`HolidayTrip` which references to a `Holiday`'s and `Guide`'s id. It should have the following properties

- Long id
- Instant fromDate
- Instant toDate
- BigDecimal priceSingleRoom
- BigDecimal priceDoubleRoom
- String currency
- Long holidayId
- Long guideId

### 1.2.3. `Holiday`

The existing class `Holiday` also gets an upgrade. Add the property `List<HolidayTrip> holidayTrips`. Also adapt `DefaultHolidaysRepository` and `FsHolidaysRepository`. When they instantiate `Holiday`, they should pass an empty `ArrayList` for `holidayTrips`.

<details>
<summary>Show Solution</summary>
<p>

**/src/main/java/com/softarc/eternal/domain/Guide.java**

```java
package com.softarc.eternal.domain;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Guide {

  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String phoneNr;
  private String bio;
}

```

**/src/main/java/com/softarc/eternal/domain/HolidayTrip.java**

```java
package com.softarc.eternal.domain;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HolidayTrip {

  private Long id;
  private Instant fromDate;
  private Instant toDate;
  private BigDecimal priceSingleRoom;
  private BigDecimal priceDoubleRoom;
  private String currency;
  private Long holidayId;
  private Long guideId;
}

```

**/src/main/java/com/softarc/eternal/domain/Holiday.java**

```java
package com.softarc.eternal.domain;

// ...

public class Holiday {

  // ...

  @Builder.Default
  private List<HolidayTrip> trips = new ArrayList<>();
}

```

</p>
</details>

## 1.3. Object Mothers

Before we start with any test, we have to write ObjectMothers for our domain classes. It will make our testing life much easier.

Implementation of `HolidayMother`

**src/test/java/com/softarc/eternal/domain/HolidayMother.java**

```java
package com.softarc.eternal.domain;

public class HolidayMother extends Holiday {

  private static Long id = 1L;

  public static HolidayBuilder vienna() {
    return Holiday
      .builder()
      .id(++HolidayMother.id)
      .name("Vienna")
      .description("This is a default description");
  }
}

```

They should be used in the following ways:

```java
// build() comes from Lombok's builder

class ObjectMotherTest() {

  @Test
  public void testObjectMothers() {
    // Holidays
   Holiday holiday = HolidayMother.vienna().build();

   // Guide
   Guide guide = GuideMother.deborah().build();

   // HolidayTrip
   // 2nd paramter is the fromDate, and the third the amount of days
   HolidayTrip holidayTrip = HolidayTripMother.standard(holiday, LocalDate.of(2022, 11, 28), 7).build();
  }
}
```

<details>
<summary>Show Solution</summary>
<p>

**src/test/java/com/softarc/eternal/domain/GuideMother.java**

```java
package com.softarc.eternal.domain;

public class GuideMother {

  static Long id = 1L;

  public static Guide.GuideBuilder deborah() {
    return Guide
      .builder()
      .id(++GuideMother.id)
      .firstname("Deborah")
      .lastname("McArthur")
      .email("deborah.mcarthur@eternal-holidays.com")
      .phoneNr("+123321")
      .bio(
        """
          Deborah visited Vancouver as a teenager and immediately fell in love
          with its landscape, culture, and people. She likes to share her passion
          for Canada with anybody who's is interested"""
      );
  }
}

```

**src/test/java/com/softarc/eternal/domain/HolidayTripMother.java**

```java
package com.softarc.eternal.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

public class HolidayTripMother {

  private static Long id = 1L;

  public static HolidayTrip.HolidayTripBuilder standard(
    Holiday holiday,
    LocalDate startDay,
    Integer durationInDays
  ) {
    var fromDate = Instant.from(startDay.atStartOfDay(ZoneOffset.UTC));
    var toDate = fromDate.plus(durationInDays, ChronoUnit.DAYS);
    return HolidayTrip
      .builder()
      .id(++HolidayTripMother.id)
      .fromDate(fromDate)
      .toDate(toDate)
      .holidayId(holiday.getId());
  }
}

```

</p>
</details>

# 2. Basic Unit Tests

Write three tests for `DefaultHolidaysRepository`.

## 2.1. `testInitialEmptyHolidays`

This test should verify that `DefaultHolidaysRepository::findAll` returns an empty list upon instantiation.

<details>
<summary>Show Solution</summary>
<p>

```java
package com.softarc.eternal.data;

// ...

class DefaultHolidaysRepositoryTest {

  public DefaultHolidaysRepository setup() {
    return new DefaultHolidaysRepository(Collections.emptyList());

  @Test
  public void testInitialEmptyHolidays() {
    var holiday = HolidayMother.vienna().build();
    var repository = setup();
    assertThat(repository.findAll()).isEmpty();
  }
}

```

</p>
</details>

## 2.2. `testSettingHolidays`

This test should create a new `Holiday` via `HolidayMother`, and instantiate the `DefaultHolidaysRepository` with it. Afterwards, verify that `DefaultHolidaysRepository` returns that holiday instance on `findAll`.

<details>
<summary>Show Solution</summary>
<p>

```java
class DefaultHolidaysRepositoryTest {

  // ...

  public DefaultHolidaysRepository setup(Holiday... holidays) {
    return new DefaultHolidaysRepository(Arrays.asList(holidays));
  }

  @Test
  public void testSettingHolidays() {
    var holiday = HolidayMother.vienna().build();
    var repository = setup(holiday);
    assertThat(repository.findAll()).contains(holiday);
  }
}

```

</p>
</details>

## 2.3. `testAddingHolidays`

Verify that `DefaultHolidaysRepository::add` adds a holiday and returns it on `findAll`.

<details>
<summary>Show Solution</summary>
<p>

```java
class DefaultHolidaysRepositoryTest {

  // ...

  @Test
  public void testAddingHoliday() {
    var holiday = HolidayMother.vienna().build();
    var repository = setup();
    repository.add("Vienna");

    assertThat(repository.findAll())
      .hasSize(1)
      .extracting(Holiday::getName)
      .allSatisfy(name -> assertThat(name).isEqualTo("Vienna"));
  }
}

```

</p>
</details>

# 3. Add `HolidayTrip`

Add a the method `void HolidaysRepository::addTrip(Long holidayId, HolidayTrip holidayTrip)`. It should - as the name says - add a `HolidayTrip` to `Holiday`. Implement it only in `DefaultHolidaysRepository`. `FsHolidaysRepository` should throw an error when it is called.

Write a test to verify, that a trip can be added.

<details>
<summary>Show Solution</summary>
<p>

**DefaultHolidaysRepository.java**

```java
public class DefaultHolidaysRepository implements HolidaysRepository {

  // ...

  @Override
  public void addTrip(Long holidayId, HolidayTrip holidayTrip) {
    var holiday = this.find(holidayId).orElseThrow();
    holiday.getTrips().add(holidayTrip);
  }
}

```

**DefaultHolidaysRepositoryTest.java**

```java
class DefaultHolidaysRepositoryTest {

  // ...
  @Test
  public void testAddTrip() {
    var holiday = HolidayMother.vienna().build();
    var trip = HolidayTripMother
      .standard(holiday, LocalDate.of(2022, 11, 28), 7)
      .build();
    var repository = setup(holiday);
    repository.addTrip(holiday.getId(), trip);

    assertThat(repository.find(holiday.getId()).get().getTrips())
      .contains(trip)
      .hasSize(1);
  }
}

```

</p>
</details>

# 4. Add Guide with Overlapping

Add the method `void HolidaysRepository::assignGuide(Long holidayTripId, Guide guide)`. It should assign a guide to a trip but throw an error, if the guide is alreay assigned to another trip at the same time.

**Please note**: You can/should copy the implementation and try to write a test afterwards.

<details>
<summary>Show Implementation</summary>
<p>

```java
public class DefaultHolidaysRepository implements HolidaysRepository {

  // ...

  @Override
  public void assignGuide(Long holidayTripId, Guide guide) {
    var holidayTrip =
      this.findTripId(holidayTripId)
        .orElseThrow(() ->
          new RuntimeException(
            String.format("Cannot find Trip %s", guide.toString())
          )
        );

    this.findAll()
      .stream()
      .flatMap(holiday -> holiday.getTrips().stream())
      .filter(filterOverlappingTrip(holidayTripId, guide, holidayTrip))
      .findFirst()
      .ifPresent(trip -> this.throwAlreadyAssignedException(trip, guide));

    holidayTrip.setGuideId(guide.getId());
  }

  private Predicate<HolidayTrip> filterOverlappingTrip(
    Long holidayTripId,
    Guide guide,
    HolidayTrip holidayTrip
  ) {
    return trip ->
      trip.getGuideId() != null &&
      !trip.getId().equals(holidayTripId) &&
      trip.getGuideId().equals(guide.getId()) &&
      this.isTripOverlapping(holidayTrip, trip);
  }

  private Optional<HolidayTrip> findTripId(Long holidayTripId) {
    return this.holidays.stream()
      .flatMap(holiday -> holiday.getTrips().stream())
      .filter(holidayTrip -> holidayTrip.getId().equals(holidayTripId))
      .findFirst();
  }

  private void throwAlreadyAssignedException(HolidayTrip trip, Guide guide) {
    throw new RuntimeException(
      String.format(
        "Guide %d already assigned to trip %d",
        guide.getId(),
        trip.getId()
      )
    );
  }

  private boolean isTripOverlapping(HolidayTrip trip1, HolidayTrip trip2) {
    return (
      trip1.getFromDate().isBefore(trip2.getToDate()) &&
      trip2.getFromDate().isBefore(trip1.getToDate())
    );
  }
}

```

</p>
</details>

---

<details>
<summary>Show Solution</summary>
<p>

```java
package com.softarc.eternal.data;

// ...

class DefaultHolidaysRepositoryTest {

  // ...

  @Test
  public void testPreventGuideAssignmentFromOverlappingTrips() {
    var holiday = HolidayMother.vienna().build();
    var trip1 = HolidayTripMother
      .standard(holiday, LocalDate.parse("2022-01-01"), 7)
      .build();
    var trip2 = HolidayTripMother
      .standard(holiday, LocalDate.parse("2022-01-01"), 7)
      .build();
    var deborah = GuideMother.deborah().build();

    var repository = setup(holiday);
    repository.addTrip(holiday.getId(), trip1);
    repository.addTrip(holiday.getId(), trip2);

    repository.assignGuide(trip1.getId(), deborah);

    assertThatThrownBy(() -> repository.assignGuide(trip2.getId(), deborah));
  }
}

```

</p>
</details>

# 5. Add Parameterised Guide with Overlapping

Modify your last test for `assignGuide` so that it tries out multiple trip variations. Write a Parameterised test for it.

Replace the annotation `@Test` with

```java
@ParameterizedTest
@MethodSource("overlappingParametersProvider")
```

The parameter is of type

```java
record OverlappingParameter(
  LocalDate start1,
  int durationInDays1,
  LocalDate start2,
  int durationInDays2,
  boolean isOverlapping
) {}

```

The parameters have to be provided by the static method `overlappingParametersProvider`:

```java
static List<OverlappingParameter> overlappingParametersProvider() {
    return Arrays.asList(
      new OverlappingParameter(
        LocalDate.parse("2022-01-01"),
        7,
        LocalDate.parse("2022-01-02"),
        7,
        true
      ),
      new OverlappingParameter(
        LocalDate.parse("2022-01-01"),
        7,
        LocalDate.parse("2022-02-01"),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.parse("2022-02-01"),
        7,
        LocalDate.parse("2022-01-01"),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.parse("2022-02-01"),
        7,
        LocalDate.parse("2022-01-01"),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.parse("2022-01-01"),
        7,
        LocalDate.parse("2022-01-04"),
        2,
        true
      ),
      new OverlappingParameter(
        LocalDate.parse("2022-01-04"),
        2,
        LocalDate.parse("2022-01-01"),
        7,
        true
      )
    );
  }

```

# 6. Extract Overlapping to class and mock it

## 6.1. Unit Test

- Verify that FsHolidaysRepository is used
  - Set Profile and verify `DefaultHolidaysRepository` is used
  - Use `@MockBean`
- Write Integration Tests

  - Verify Repository Bean
  - Set Profile
  - Set Configuration Parameter

- Measure Test Coverage

# 7. Further Exercises

- Code Coverage via Jacoco and thresholds
- Write Unit Tests for the `FsHolidaysRepository`.
- Try to write an E2E test which covers the frontend, backend and the persistence layer (most of the times a database)
-
