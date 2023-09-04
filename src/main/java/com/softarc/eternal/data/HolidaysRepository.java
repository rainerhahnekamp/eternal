package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class HolidaysRepository {

  private final List<Holiday> holidays = new ArrayList<>();
  private Long currentId = 3L;

  public HolidaysRepository() {
    this.holidays.add(new Holiday(1L, "Canada", "Visit Rocky Mountains"));
    this.holidays.add(new Holiday(2L, "China", "To the Middle Kingdom"));
  }

  public List<Holiday> findAll() {
    return this.holidays;
  }

  public void add(String name) {
    var holiday = new Holiday(this.currentId++, name, "-");
    this.holidays.add(holiday);
  }

  public Optional<Holiday> find(Long id) {
    for (Holiday holiday : this.holidays) {
      if (holiday.getId().equals(id)) {
        return Optional.of(holiday);
      }
    }

    return Optional.empty();
  }

  public void remove(Long id) {
    this.holidays.removeIf(holiday -> holiday.getId().equals(id));
  }
}
