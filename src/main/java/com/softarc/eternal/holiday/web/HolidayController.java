package com.softarc.eternal.holiday.web;

import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.Holiday;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holiday")
@RestController
public class HolidayController {

  private final HolidayRepository repository;
  private final HolidayMapper holidayMapper;

  public HolidayController(HolidaysRepository repository, HolidayMapper holidayMapper) {
    this.repository = repository;
    this.holidayMapper = holidayMapper;
  }

  @GetMapping
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(holidaysMapper::holidayToResponse)
      .toList();
  }

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(holidaysMapper::holidayToResponse)
      .orElseThrow(IdNotFoundException::new);
  }

  @PostMapping
  public void add(@RequestBody HolidayDto holidayDto) {
    this.repository.add(holidayDto.name(), holidayDto.description());
  }

  @PutMapping
  public void update(@RequestBody HolidayDto holidayDto) {
    this.repository.update(
        holidayDto.id(),
        holidayDto.name(),
        holidayDto.description()
      );
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
