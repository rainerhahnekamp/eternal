package com.softarc.eternal.holiday.web;

import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.Holiday;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holiday")
@RestController
public class HolidayController {

  private final HolidayRepository repository;

  public HolidayController(HolidayRepository repository) {
    this.repository = repository;
  }

  @GetMapping("{id}")
  public Holiday find(@PathVariable("id") Long id) {
    return this.repository.find(id).orElseThrow();
  }

  @PostMapping("{name}")
  public void add(@PathVariable("name") String name) {
    this.repository.add(name);
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
