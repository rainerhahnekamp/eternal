package com.softarc.eternal.data;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softarc.eternal.domain.Guide;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayTrip;
import java.io.File;
import java.nio.file.Paths;
import java.util.*;
import lombok.SneakyThrows;
import lombok.extern.java.Log;

@Log
public class FsHolidaysRepository implements HolidaysRepository {

  private final ObjectMapper objectMapper;
  private final List<Holiday> holidays;
  private final File file;
  private Long currentId;

  @SneakyThrows
  public FsHolidaysRepository(ObjectMapper objectMapper, String filename) {
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
      .map(Holiday::getId)
      .max(Long::compareTo)
      .orElse(0L);
  }

  private void init() {
    this.holidays.clear();
    holidays.add(
      new Holiday(
        1L,
        "Canada",
        "Visit Rocky Mountains",
        Optional.empty(),
        new HashSet<>()
      )
    );
    holidays.add(
      new Holiday(
        2L,
        "China",
        "To the Middle Kingdom",
        Optional.empty(),
        new HashSet<>()
      )
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
  public void add(String name, String description, Optional<String> optCover) {
    this.holidays.add(
        new Holiday(
          ++this.currentId,
          name,
          description,
          optCover,
          new HashSet<>()
        )
      );
    this.persist();
    FsHolidaysRepository.log.info(String.format("Holiday %s was added", name));
  }

  @Override
  public void update(
    Long id,
    String name,
    String description,
    Optional<String> optCover
  ) {
    var holiday = this.find(id).orElseThrow();
    holiday.setName(name);
    holiday.setDescription(description);
    holiday.setCoverPath(optCover);
    this.persist();
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
    this.find(id)
      .ifPresentOrElse(
        holiday -> {
          this.holidays.remove(holiday);
          this.persist();
          FsHolidaysRepository.log.info(
            String.format("Holiday %s was removed", holiday.getName())
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
