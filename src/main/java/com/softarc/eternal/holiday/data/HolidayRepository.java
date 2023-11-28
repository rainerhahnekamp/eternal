package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Holiday;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface HolidayRepository extends CrudRepository<Holiday, Long> {
  List<Holiday> findAll();
}
