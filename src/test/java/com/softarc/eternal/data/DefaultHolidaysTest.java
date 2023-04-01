package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.softarc.eternal.domain.GuideMother;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayMother;
import com.softarc.eternal.domain.HolidayTripMother;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DefaultHolidaysTest {

  @Mock
  OverlappingCalculator mockedOverlappingCalculator;

  public DefaultHolidays setup() {
    return new DefaultHolidays(
      Collections.emptyList(),
      this.mockedOverlappingCalculator
    );
  }

  public DefaultHolidays setup(Holiday... holidays) {
    return new DefaultHolidays(
      Arrays.asList(holidays),
      this.mockedOverlappingCalculator
    );
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
    repository.add("Vienna", "Urlaub in Wien", Optional.empty());

    assertThat(repository.findAll())
      .hasSize(1)
      .extracting(Holiday::getName)
      .allSatisfy(name -> assertThat(name).isEqualTo("Vienna", "Urlaub in Wien")
      );
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

  @Test
  public void testAssignGuideShouldThrowOnOverlap() {
    // arrange
    var holiday = HolidayMother.vienna().build();
    var start1 = LocalDate
      .parse("2022-01-01")
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end1 = start1.plus(7, ChronoUnit.DAYS);
    var start2 = LocalDate
      .parse("2022-01-05")
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
