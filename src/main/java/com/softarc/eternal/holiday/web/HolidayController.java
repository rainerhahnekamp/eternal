package com.softarc.eternal.holiday.web;

import com.softarc.eternal.common.IdNotFoundException;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.web.mapping.HolidayMapper;
import com.softarc.eternal.holiday.web.request.HolidayDto;
import com.softarc.eternal.holiday.web.response.HolidayResponse;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/holiday")
@RestController
public class HolidayController {

  private final HolidayRepository repository;
  private final HolidayMapper holidayMapper;

  public HolidayController(HolidayRepository repository, HolidayMapper holidayMapper) {
    this.repository = repository;
    this.holidayMapper = holidayMapper;
  }

  @GetMapping
  @Cacheable(value = "holiday", key = "'all'")
  public List<HolidayResponse> index() {
    return this.repository.findAll().stream().map(holidayMapper::holidayToResponse).toList();
  }

  @GetMapping("{id}")
  @Cacheable(value = "holiday", key = "#id")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository
        .find(id)
        .map(holidayMapper::holidayToResponse)
        .orElseThrow(IdNotFoundException::new);
  }

  @PostMapping
  @CachePut(value = "holiday", key = "#holidayDto.id()")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse add(@RequestBody HolidayDto holidayDto) {
    var holiday = this.repository.add(holidayDto.name(), holidayDto.description());
    return this.holidayMapper.holidayToResponse(holiday);
  }

  @PutMapping
  @CachePut(value = "holiday", key = "#holidayDto.id()")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse update(@RequestBody HolidayDto holidayDto) {
    var holiday = this.repository.update(holidayDto.id(), holidayDto.name(), holidayDto.description());
    return this.holidayMapper.holidayToResponse(holiday);
  }

  @DeleteMapping("{id}")
  @Caching(
      evict = {
        @CacheEvict(value = "holiday", key = "#id"),
        @CacheEvict(value = "holiday", key = "'all'")
      })
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }
}
