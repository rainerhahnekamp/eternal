package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Holiday;
import java.util.List;
import java.util.Optional;

public interface HolidayRepository {
  List<Holiday> findAll();

  void add(String name);

  Optional<Holiday> find(Long id);

  void remove(Long id);

  void addTrip(Long holidayId, HolidayTrip holidayTrip);

  void assignGuide(Long id, Guide deborah);
}
