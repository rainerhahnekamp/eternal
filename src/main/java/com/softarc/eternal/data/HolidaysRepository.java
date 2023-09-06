package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface HolidaysRepository extends CrudRepository<Holiday, Long> {
  List<Holiday> findAll();
}
