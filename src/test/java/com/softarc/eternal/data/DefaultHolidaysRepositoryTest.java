package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.*;

import com.softarc.eternal.domain.GuideMother;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.domain.HolidayTripMother;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

record OverlappingParameter(
  LocalDate start1,
  int durationInDays1,
  LocalDate start2,
  int durationInDays2,
  boolean isOverlapping
) {}

class DefaultHolidaysRepositoryTest {

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

  public DefaultHolidaysRepository setup() {
    return new DefaultHolidaysRepository(Collections.emptyList());
  }

  public DefaultHolidaysRepository setup(Holiday... holidays) {
    return new DefaultHolidaysRepository(Arrays.asList(holidays));
  }

  @Test
  public void testInitialEmptyHolidays() {
    var holiday = HolidayMother.vienna().build();
    var repository = setup();
    assertThat(repository.findAll()).isEmpty();
  }

  @Test
  public void testSettingHolidays() {
    var holiday = HolidayMother.vienna().build();
    var repository = setup(holiday);
    assertThat(repository.findAll()).contains(holiday);
  }

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

  @ParameterizedTest
  @MethodSource("overlappingParametersProvider")
  public void testPreventGuideAssignmentToOverlappingTrips(
    OverlappingParameter overlappingParameter
  ) {
    var holiday = HolidayMother.vienna().build();
    var trip1 = HolidayTripMother
      .standard(
        holiday,
        overlappingParameter.start1(),
        overlappingParameter.durationInDays1()
      )
      .build();
    var trip2 = HolidayTripMother
      .standard(
        holiday,
        overlappingParameter.start2(),
        overlappingParameter.durationInDays2()
      )
      .build();
    var deborah = GuideMother.deborah().build();

    var repository = setup(holiday);
    repository.addTrip(holiday.getId(), trip1);
    repository.addTrip(holiday.getId(), trip2);

    repository.assignGuide(trip1.getId(), deborah);

    ThrowableAssert.ThrowingCallable assignment = () ->
      repository.assignGuide(trip2.getId(), deborah);
    if (overlappingParameter.isOverlapping()) {
      assertThatThrownBy(assignment);
    } else {
      assertThatCode(assignment).doesNotThrowAnyException();
    }
  }
}
