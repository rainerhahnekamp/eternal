package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.web.exception.IdNotFoundException;
import com.softarc.eternal.web.mapping.HolidaysMapper;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/holidays")
@RestController
@Tag(name = "Holidays")
public class HolidaysController {

  private final HolidaysRepository repository;
  private final HolidaysMapper holidaysMapper;

  public HolidaysController(HolidaysRepository repository, HolidaysMapper holidaysMapper) {
    this.repository = repository;
    this.holidaysMapper = holidaysMapper;
  }

  @GetMapping
  @Operation(operationId = "findAll")
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(holidaysMapper::holidayToResponse)
      .toList();
  }

  @GetMapping("{id}")
  @Operation(operationId = "findById")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.find(id)
      .map(holidaysMapper::holidayToResponse)
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
}
