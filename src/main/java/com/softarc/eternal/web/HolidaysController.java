package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import jakarta.validation.Valid;
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
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(this::toHolidayResponse)
      .toList();
  }

  @GetMapping("{id}")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id).map(this::toHolidayResponse).orElseThrow();
  }

  @PostMapping
  public void add(@RequestBody @Valid HolidayDto holidayDto) {
    this.repository.add(holidayDto.name(), holidayDto.description());
  }

  @PutMapping
  public void update(@RequestBody @Valid HolidayDto holidayDto) {
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

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription()
    );
  }
}
