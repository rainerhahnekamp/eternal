package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.exception.IdNotFoundException;
import com.softarc.eternal.web.mapping.HolidaysMapper;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  private final HolidaysRepository repository;
  private final HolidaysMapper holidaysMapper;

  public HolidaysController(HolidaysRepository repository, HolidaysMapper holidaysMapper) {
    this.repository = repository;
    this.holidaysMapper = holidaysMapper;
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
