package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Guide;
import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.domain.HolidayTrip;
import java.util.List;
import java.util.Optional;

public interface HolidayRepository {
  List<Holiday> findAll();

  Holiday add(String name, String description);

  Holiday update(Long id, String name, String description);

  Optional<Holiday> find(Long id);

  void remove(Long id);

  void addTrip(Long holidayId, HolidayTrip holidayTrip);

  void assignGuide(Long id, Guide deborah);
}