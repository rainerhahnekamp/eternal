package com.softarc.eternal.holiday.web;

import com.softarc.eternal.common.IdNotFoundException;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.web.mapping.HolidayMapper;
import com.softarc.eternal.holiday.web.request.HolidayDto;
import com.softarc.eternal.holiday.web.response.HolidayResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holiday")
@RestController
@Tag(name = "Holiday")
public class HolidayController {

  private final HolidayRepository repository;
  private final HolidayMapper holidayMapper;

  public HolidayController(HolidayRepository repository, HolidayMapper holidayMapper) {
    this.repository = repository;
    this.holidayMapper = holidayMapper;
  }

  @GetMapping
  @Operation(operationId = "findAll")
  @Cacheable(value = "holiday", key = "'all'")
  public List<HolidayResponse> index() {
    return this.repository.findAll().stream().map(holidayMapper::holidayToResponse).toList();
  }

  @GetMapping("{id}")
  @Operation(operationId = "findById")
  @Cacheable(value = "holiday", key = "#id")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository
        .find(id)
        .map(holidayMapper::holidayToResponse)
        .orElseThrow(IdNotFoundException::new);
  }

  @PostMapping
  @Operation(operationId = "add")
  @CachePut(value = "holiday", key = "#holidayDto.id()")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse add(@RequestBody @Valid HolidayDto holidayDto) {
    var holiday = this.repository.add(holidayDto.name(), holidayDto.description());
    return this.holidayMapper.holidayToResponse(holiday);
  }

  @PutMapping
  @Operation(operationId = "save")
  @CachePut(value = "holiday", key = "#holidayDto.id()")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse update(@RequestBody HolidayDto holidayDto) {
    var holiday = this.repository.update(holidayDto.id(), holidayDto.name(), holidayDto.description());
    return this.holidayMapper.holidayToResponse(holiday);
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
  @Caching(
      evict = {
        @CacheEvict(value = "holiday", key = "#id"),
        @CacheEvict(value = "holiday", key = "'all'")
      })
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
