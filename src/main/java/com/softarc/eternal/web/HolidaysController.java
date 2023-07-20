package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.web.exception.IdNotFoundException;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RequestMapping("/api/holidays")
@RestController
@Tag(name = "Holidays")
public class HolidaysController {

  private final HolidaysRepository repository;

  public HolidaysController(HolidaysRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  @Operation(operationId = "findAll")
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(this::toHolidayResponse)
      .toList();
  }

  @GetMapping("{id}")
  @Operation(operationId = "findById")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(this::toHolidayResponse)
      .orElseThrow(IdNotFoundException::new);
  }

  @PostMapping
  @Operation(operationId = "add")
  public boolean add(@RequestBody @Valid HolidayDto holidayDto) {
    this.repository.add(holidayDto.name(), holidayDto.description());
    return true;
  }

  @PutMapping
  @Operation(operationId = "save")
  public void update(@RequestBody @Valid HolidayDto holidayDto) {
    this.repository.update(
        holidayDto.id(),
        holidayDto.name(),
        holidayDto.description()
      );
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription(),
      Collections.emptyList()
    );
  }
}
