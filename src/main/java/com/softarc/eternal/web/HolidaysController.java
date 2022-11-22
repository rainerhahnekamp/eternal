package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
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

  @PostMapping("{name}")
  public void add(@PathVariable("name") String name) {
    this.repository.add(name);
  }

  @DeleteMapping("{id}")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
