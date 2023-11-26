package com.softarc.eternal.holiday.data;

import static org.assertj.core.api.Assertions.*;

import com.softarc.eternal.holiday.domain.GuideMother;
import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.domain.HolidayMother;
import com.softarc.eternal.holiday.domain.HolidayTripMother;
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

  public DefaultHolidayRepository setup() {
    return new DefaultHolidayRepository(Collections.emptyList());
  }

  public DefaultHolidayRepository setup(Holiday... holidays) {
    return new DefaultHolidayRepository(Arrays.asList(holidays));
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
      .extracting(Holiday::name)
      .allSatisfy(name -> assertThat(name).isEqualTo("Vienna"));
  }

  @Test
  public void testAddTrip() {
    var holiday = HolidayMother.vienna().build();
    var trip = HolidayTripMother
      .standard(holiday, LocalDate.of(2022, 11, 28), 7)
      .build();
    var repository = setup(holiday);
    repository.addTrip(holiday.id(), trip);

    assertThat(repository.find(holiday.id()).get().trips())
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
    repository.addTrip(holiday.id(), trip1);
    repository.addTrip(holiday.id(), trip2);

    repository.assignGuide(trip1.id(), deborah);

    ThrowableAssert.ThrowingCallable assignment = () ->
      repository.assignGuide(trip2.id(), deborah);
    if (overlappingParameter.isOverlapping()) {
      assertThatThrownBy(assignment);
    } else {
      assertThatCode(assignment).doesNotThrowAnyException();
    }
  }

  static List<OverlappingParameter> overlappingParametersProvider() {
    return Arrays.asList(
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 1, 2),
        7,
        true
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 2, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 2, 1),
        7,
        LocalDate.of(2022, 1, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 2, 1),
        7,
        LocalDate.of(2022, 1, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 1, 4),
        2,
        true
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 4),
        2,
        LocalDate.of(2022, 1, 1),
        7,
        true
      )
    );
  }
}
