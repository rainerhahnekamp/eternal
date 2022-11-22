package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.web.request.HolidayDto;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holidays")
@RestController
public class HolidaysController {

  private final HolidaysRepository repository;

  public HolidaysController(HolidaysRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Holiday> index() {
    return this.repository.findAll();
  }

  @GetMapping("{id}")
  public Holiday find(@PathVariable("id") Long id) {
    return this.repository.find(id).orElseThrow();
  }

  @PostMapping
  public boolean add(@RequestBody HolidayDto holidayDto) {
    this.repository.add(holidayDto.getName(), holidayDto.getDescription());
    return true;
  }

  @PutMapping
  public void update(@RequestBody HolidayDto holidayDto) {
    this.repository.update(
        holidayDto.getId(),
        holidayDto.getName(),
        holidayDto.getDescription()
      );
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
