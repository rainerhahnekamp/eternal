package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Guide;
import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.domain.HolidayTrip;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

public class DefaultHolidayRepository implements HolidayRepository {

  private final List<Holiday> holidays = new ArrayList<>();
  private Long currentId = 3L;
  private final OverlappingCalculator overlappingCalculator;

  public DefaultHolidayRepository(
    List<Holiday> holidays,
    OverlappingCalculator overlappingCalculator
  ) {
    this.holidays.addAll(holidays);
    this.overlappingCalculator = overlappingCalculator;
  }

  @Override
  public List<Holiday> findAll() {
    return this.holidays;
  }

  @Override
  public void add(String name, String description) {
    var holiday = new Holiday(this.currentId++, name, description, new ArrayList<>());
    this.holidays.add(holiday);
  }

  @Override
  public void update(Long id, String name, String description) {
    this.holidays.replaceAll(entry -> {
      if (entry.id().equals(id)) {
        return new Holiday(entry.id(), name, description, entry.trips());
      }
      return entry;
    });
  }

  @Override
  public Optional<Holiday> find(Long id) {
    for (Holiday holiday : this.holidays) {
      if (holiday.id().equals(id)) {
        return Optional.of(holiday);
      }
    }

    return Optional.empty();
  }

  @Override
  public void remove(Long id) {
    this.holidays.removeIf(holiday -> holiday.id().equals(id));
  }

  @Override
  public void addTrip(Long holidayId, HolidayTrip holidayTrip) {
    var holiday = this.find(holidayId).orElseThrow();
    holiday.trips().add(holidayTrip);
  }

  @Override
  public void assignGuide(Long holidayTripId, Guide guide) {
    var trip =
      this.findTripId(holidayTripId)
        .orElseThrow(() ->
          new RuntimeException(
            String.format("Cannot find Trip %s", guide.toString())
          )
        );
    var holiday = this.find(trip.holidayId()).orElseThrow();

    this.findAll()
      .stream()
      .flatMap(entry -> entry.trips().stream())
      .filter(filterOverlappingTrip(holidayTripId, guide, trip))
      .findFirst()
      .ifPresent(entry -> this.throwAlreadyAssignedException(entry, guide));

    var assignedTrip = new HolidayTrip(
      trip.id(),
      trip.fromDate(),
      trip.toDate(),
      trip.priceSingleRoom(),
      trip.priceDoubleRoom(),
      trip.currency(),
      trip.holidayId(),
      guide.id());

    holiday.trips().replaceAll(
      entry -> {
        if (entry.id().equals(assignedTrip.id())) {
          return assignedTrip;
        }
        return entry;
      });
  }

  private Predicate<HolidayTrip> filterOverlappingTrip(
    Long holidayTripId,
    Guide guide,
    HolidayTrip holidayTrip
  ) {
    return trip ->
      trip.guideId() != null &&
      !trip.id().equals(holidayTripId) &&
      trip.guideId().equals(guide.id()) &&
      this.isTripOverlapping(trip, holidayTrip);
  }

  private Optional<HolidayTrip> findTripId(Long holidayTripId) {
    return this.holidays.stream()
      .flatMap(holiday -> holiday.trips().stream())
      .filter(holidayTrip -> holidayTrip.id().equals(holidayTripId))
      .findFirst();
  }

  private void throwAlreadyAssignedException(HolidayTrip trip, Guide guide) {
    throw new RuntimeException(
      String.format(
        "Guide %d already assigned to trip %d",
        guide.id(),
        trip.id()
      )
    );
  }

  private boolean isTripOverlapping(HolidayTrip trip1, HolidayTrip trip2) {
    return this.overlappingCalculator.isOverlapping(
        trip1.fromDate(),
        trip1.toDate(),
        trip2.fromDate(),
        trip2.toDate()
      );
  }
}
