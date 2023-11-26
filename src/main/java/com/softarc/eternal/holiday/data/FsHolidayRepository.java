package com.softarc.eternal.holiday.data;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.holiday.domain.Guide;
import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.domain.HolidayTrip;
import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import lombok.SneakyThrows;
import lombok.extern.java.Log;

@Log
public class FsHolidayRepository implements HolidayRepository {

  private final ObjectMapper objectMapper;
  private final List<Holiday> holidays;

  private Long currentId;
  private final File file;

  @SneakyThrows
  public FsHolidayRepository(ObjectMapper objectMapper, String filename) {
    this.objectMapper = objectMapper;
    file = Paths.get(filename).toFile();

    if (!this.file.exists()) {
      this.holidays = new ArrayList<>();
      this.init();
    } else {
      this.holidays =
        new ArrayList<>(
          Arrays.asList(this.objectMapper.readValue(this.file, Holiday[].class))
        );

      this.currentId = getCurrentId();
    }
  }

  private Long getCurrentId() {
    return this.holidays.stream()
      .map(Holiday::id)
      .max(Long::compareTo)
      .orElse(0L);
  }

  private void init() {
    this.holidays.clear();
    holidays.add(
      new Holiday(1L, "Canada", "Visit Rocky Mountains", new ArrayList<>())
    );
    holidays.add(
      new Holiday(2L, "China", "To the Middle Kingdom", new ArrayList<>())
    );
    this.currentId = this.getCurrentId();
    this.persist();
  }

  @SneakyThrows
  private void persist() {
    this.objectMapper.writeValue(this.file, this.holidays);
  }

  @Override
  public List<Holiday> findAll() {
    return this.holidays;
  }

  @Override
  public void add(String name) {
    this.holidays.add(
        new Holiday(++this.currentId, name, "-", new ArrayList<>())
      );
    this.persist();
    FsHolidayRepository.log.info(String.format("Holiday %s was added", name));
  }

  @Override
  public Optional<Holiday> find(Long id) {
    for (Holiday holiday : this.holidays) {
      if (holiday.id().equals(id)) {
        return Optional.of(holiday);
      }
    }

    return Optional.empty();
  }

  @Override
  public void remove(Long id) {
    this.find(id)
      .ifPresentOrElse(
        holiday -> {
          this.holidays.remove(holiday);
          this.persist();
          FsHolidayRepository.log.info(
            String.format("Holiday %s was removed", holiday.name())
          );
        },
        () -> {
          throw new RuntimeException(
            String.format("could not find Holiday with id %d", id)
          );
        }
      );
  }

  @Override
  public void addTrip(Long holidayId, HolidayTrip holidayTrip) {
    throw new RuntimeException("not implemented yet");
  }

  @Override
  public void assignGuide(Long id, Guide deborah) {}
}
