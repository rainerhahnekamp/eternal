package com.softarc.eternal.holiday.web;

import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.Holiday;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holiday")
@RestController
public class HolidayController {

  private final HolidayRepository repository;

  public HolidayController(HolidayRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Holiday> index() {
    return this.repository.findAll();
  }

  @GetMapping("{id}")
  public Holiday find(@PathVariable() Long id) {
    return this.repository.find(id).orElseThrow();
  }

  @PostMapping("{name}")
  public void add(@PathVariable() String name) {
    this.repository.add(name);
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable() Long id) {
    this.repository.remove(id);
  }
}
