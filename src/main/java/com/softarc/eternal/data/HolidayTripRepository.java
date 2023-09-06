package com.softarc.eternal.data;

import com.softarc.eternal.domain.HolidayTrip;
import org.springframework.data.repository.CrudRepository;

public interface HolidayTripRepository
  extends CrudRepository<HolidayTrip, Long> {}
