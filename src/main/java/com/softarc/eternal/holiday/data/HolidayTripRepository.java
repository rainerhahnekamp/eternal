package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.HolidayTrip;
import org.springframework.data.repository.CrudRepository;

public interface HolidayTripRepository
  extends CrudRepository<HolidayTrip, Long> {}
