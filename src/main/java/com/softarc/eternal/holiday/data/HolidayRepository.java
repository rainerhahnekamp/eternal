package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.List;
import java.util.Optional;

public interface HolidaysRepository {
  List<Holiday> findAll();

  void add(String name);

  Optional<Holiday> find(Long id);

  void remove(Long id);
}
