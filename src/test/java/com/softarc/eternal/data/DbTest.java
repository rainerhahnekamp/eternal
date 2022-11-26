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
  @Disabled
  void testRelationForHoliday() {
    setupFullHoliday();
    var trips = holidaysRepository
      .findByName("Vienna")
      .orElseThrow()
      .getTrips();
    assertThat(trips.size()).isEqualTo(1);
    var trip = trips.stream().toList().get(0);

    assertThat(trip.getGuide().getFirstname()).isEqualTo("Deborah");
    assertThat(trip.getHoliday().getName()).isEqualTo("Vienna");
  }

  @Test
  void testRelationForHolidayTrip() {
    setupFullHoliday();
    var trip = holidayTripRepository.findAll().iterator().next();
    assertThat(trip.getHoliday().getName()).isEqualTo("Vienna");
    assertThat(trip.getGuide().getFirstname()).isEqualTo("Deborah");
  }

  @Test
  @Disabled
  void testRelationForGuide() {
    setupFullHoliday();
    var trips = guideRepository
      .findByFirstname("Deborah")
      .orElseThrow()
      .getHolidayTrips();
    assertThat(trips.size()).isEqualTo(1);
    var trip = trips.stream().toList().get(0);

    assertThat(trip.getGuide().getFirstname()).isEqualTo("Deborah");
    assertThat(trip.getHoliday().getName()).isEqualTo("Vienna");
  }
}
