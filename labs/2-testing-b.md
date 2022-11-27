- [1. Mocking and Improving the Tests](#1-mocking-and-improving-the-tests)
- [Further Exercises](#further-exercises)

The solution branch for the whole lab is `solution-2-2-advanced`.

# 1. Mocking and Improving the Tests

The unit test for `assignGuide` is not optimal. We need a lot of complexity only to test the overlapping algorithm. We can do better.

Whenever, we have an algorithm, we should extract it into an own class `OverlappingCalculator`. Writing unit tests for such a small class is much easier.

The `DefaultHolidaysRepository` needs to inject `OverlappingCalculator` but we don't have to test the overlapping cases anymore. It is enough, if the unit test for `DefaultHolidaysRepository` mocks the `OverlappingCalculator` in a way that it throws an exception. We only need to test it once, the details are covered in the unit test for `OverlappingCalculator`.

Make the refactoring to improve your test code.

<details>
<summary>Show Solution</summary>
<p>

**OverlappingCalculator.java**

```java
package com.softarc.eternal.data;

import com.softarc.eternal.domain.HolidayTrip;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class OverlappingCalculator {

  boolean isOverlapping(
    Instant start1,
    Instant end1,
    Instant start2,
    Instant end2
  ) {
    return start1.isBefore(end2) && start2.isBefore(end1);
  }
}

```

**OverlappingCalculatorTest.java**

```java
package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class OverlappingCalculatorTest {

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

  @ParameterizedTest
  @MethodSource("overlappingParametersProvider")
  public void testPreventGuideAssignmentToOverlappingTrips(
    OverlappingParameter overlappingParameter
  ) {
    var calculator = new OverlappingCalculator();
    var start1 = overlappingParameter
      .start1()
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end1 = start1.plus(
      overlappingParameter.durationInDays1(),
      ChronoUnit.DAYS
    );
    var start2 = overlappingParameter
      .start2()
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end2 = start2.plus(
      overlappingParameter.durationInDays2(),
      ChronoUnit.DAYS
    );

    assertThat(calculator.isOverlapping(start1, end1, start2, end2))
      .isEqualTo(overlappingParameter.isOverlapping());
  }
}

```

**DefaultHolidaysRepository.java**

```java
package com.softarc.eternal.data;

// ...

public class DefaultHolidaysRepository implements HolidaysRepository {

  // ...
  private final OverlappingCalculator overlappingCalculator;

  public DefaultHolidaysRepository(
    List<Holiday> holidays,
    OverlappingCalculator overlappingCalculator
  ) {
    this.holidays.addAll(holidays);
    this.overlappingCalculator = overlappingCalculator;
  }

  // ...

  private boolean isTripOverlapping(HolidayTrip trip1, HolidayTrip trip2) {
    return this.overlappingCalculator.isOverlapping(
        trip1.getFromDate(),
        trip1.getToDate(),
        trip2.getFromDate(),
        trip2.getToDate()
      );
  }
}

```

**DefaultHolidaysRepositoryTest.java**

```java
package com.softarc.eternal.data;

// ...

@ExtendWith(MockitoExtension.class)
class DefaultHolidaysRepositoryTest {

  // ...

  @Mock
  OverlappingCalculator mockedOverlappingCalculator;

  public DefaultHolidaysRepository setup() {
    return new DefaultHolidaysRepository(
      Collections.emptyList(),
      this.mockedOverlappingCalculator
    );
  }

  public DefaultHolidaysRepository setup(Holiday... holidays) {
    return new DefaultHolidaysRepository(
      Arrays.asList(holidays),
      this.mockedOverlappingCalculator
    );
  }

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

  @Test
  public void testAssignGuideShouldThrowOnOverlap() {
    // arrange
    var holiday = HolidayMother.vienna().build();
    var start1 = LocalDate
      .of(2022, 1, 1)
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end1 = start1.plus(7, ChronoUnit.DAYS);
    var start2 = LocalDate
      .of(2022, 1, 5)
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end2 = start2.plus(7, ChronoUnit.DAYS);

    var trip1 = HolidayTripMother
      .start2022(holiday)
      .fromDate(start1)
      .toDate(end1)
      .build();
    var trip2 = HolidayTripMother
      .start2022(holiday)
      .fromDate(start2)
      .toDate(end2)
      .build();
    var deborah = GuideMother.deborah().build();
    var repository = setup(holiday);
    when(
      this.mockedOverlappingCalculator.isOverlapping(start1, end1, start2, end2)
    )
      .thenReturn(true);

    // act
    repository.addTrip(holiday.getId(), trip1);
    repository.assignGuide(trip1.getId(), deborah);
    repository.addTrip(holiday.getId(), trip2);

    // assert
    assertThatThrownBy(() -> repository.assignGuide(trip2.getId(), deborah))
      .hasMessageContaining(
        "Guide %d already assigned to trip %d",
        deborah.getId(),
        trip1.getId()
      );

    verify(this.mockedOverlappingCalculator)
      .isOverlapping(start1, end1, start2, end2);
  }
}

```

</p>
</details>

# Further Exercises

- Code Coverage via Jacoco and thresholds
- Write Unit Tests for the `FsHolidaysRepository`.
- Try to write an E2E test which covers the frontend, backend and the persistence layer (most of the times a database)
-
