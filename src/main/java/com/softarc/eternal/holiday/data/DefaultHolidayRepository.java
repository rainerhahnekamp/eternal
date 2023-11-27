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
  private final OverlappingCalculator overlappingCalculator;
  private Long currentId = 3L;

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
  public Holiday add(String name, String description, Optional<String> optCover) {
    var holiday = new Holiday(
      this.currentId++,
      name,
      description,
      optCover,
      new ArrayList<>()
    );
    this.holidays.add(holiday);

    return holiday;
  }

  @Override
  public Holiday update(Long id, String name, String description, Optional<String> optCover) {
    this.holidays.replaceAll(entry -> {
      if (entry.getId().equals(id)) {
        return new Holiday(entry.getId(), name, description, optCover, entry.getTrips());
      }
      return entry;
    });

    return this.find(id).orElseThrow();
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
    this.holidays.removeIf(holiday -> holiday.getId().equals(id));
  }

  @Override
  public void addTrip(Long holidayId, HolidayTrip holidayTrip) {
    var holiday = this.find(holidayId).orElseThrow();
    holiday.getTrips().add(holidayTrip);
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
    var holiday = this.find(trip.getHolidayId()).orElseThrow();

    this.findAll()
      .stream()
      .flatMap(entry -> entry.getTrips().stream())
      .filter(filterOverlappingTrip(holidayTripId, guide, trip))
      .findFirst()
      .ifPresent(entry -> this.throwAlreadyAssignedException(entry, guide));

    var assignedTrip = new HolidayTrip(
      trip.getId(),
      trip.getFromDate(),
      trip.getToDate(),
      trip.getPriceSingleRoom(),
      trip.getPriceDoubleRoom(),
      trip.getCurrency(),
      trip.getHolidayId(),
      guide.getId());

    holiday.getTrips().replaceAll(
      entry -> {
        if (entry.getId().equals(assignedTrip.getId())) {
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
      trip.getGuideId() != null &&
      !trip.getId().equals(holidayTripId) &&
      trip.getGuideId().equals(guide.getId()) &&
      this.isTripOverlapping(trip, holidayTrip);
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
    return this.overlappingCalculator.isOverlapping(
        trip1.getFromDate(),
        trip1.getToDate(),
        trip2.getFromDate(),
        trip2.getToDate()
      );
  }
}
