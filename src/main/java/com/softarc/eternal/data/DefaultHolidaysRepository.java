package com.softarc.eternal.data;

import com.softarc.eternal.domain.Guide;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayTrip;
import java.util.*;
import java.util.function.Predicate;

public class DefaultHolidaysRepository implements HolidaysRepository {

  private final List<Holiday> holidays = new ArrayList<>();
  private Long currentId = 3L;

  public DefaultHolidaysRepository(List<Holiday> holidays) {
    this.holidays.addAll(holidays);
  }

  @Override
  public List<Holiday> findAll() {
    return this.holidays;
  }

  @Override
  public void add(String name) {
    var holiday = new Holiday(this.currentId++, name, "-", new HashSet<>());
    this.holidays.add(holiday);
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
