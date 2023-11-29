package com.softarc.eternal.holiday.web;

import com.softarc.eternal.common.IdNotFoundException;
import com.softarc.eternal.common.ImageValidator;
import com.softarc.eternal.holiday.data.HolidayRepository;
import com.softarc.eternal.holiday.domain.Holiday;
import com.softarc.eternal.holiday.web.mapping.HolidayMapper;
import com.softarc.eternal.holiday.web.request.HolidayDto;
import com.softarc.eternal.holiday.web.response.HolidayResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RequestMapping("/api/holiday")
@RestController
@Tag(name = "Holiday")
public class HolidayController {

  private final HolidayRepository repository;
  private final HolidayMapper holidayMapper;
  private final ImageValidator imageValidator;

  public HolidayController(HolidayRepository repository, HolidayMapper holidayMapper, ImageValidator imageValidator) {
    this.repository = repository;
    this.holidayMapper = holidayMapper;
    this.imageValidator = imageValidator;
  }

  @GetMapping
  @Operation(operationId = "findAll")
  @Cacheable(value = "holiday", key = "'all'")
  public List<HolidayResponse> index() {
    return this.repository.findAll()
      .stream()
      .map(holidayMapper::holidayToResponse)
      .toList();
  }

  @GetMapping("{id}")
  @Operation(operationId = "findById")
  @Cacheable(value = "holiday", key = "#id")
  public HolidayResponse find(@PathVariable("id") Long id) {
    return this.repository.findById(id)
      .map(holidayMapper::holidayToResponse)
      .orElseThrow(IdNotFoundException::new);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "add")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse add(
    @RequestPart @Valid HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    this.assertFileIsImage(cover);

    var filename = cover.getOriginalFilename();
    var path = Path.of("", "filestore", filename);
    cover.transferTo(path);
    var holiday = new Holiday(
      null,
      holidayDto.name(),
      holidayDto.description(),
      filename,
      Collections.emptyList()
    );

    return this.holidayMapper.holidayToResponse(this.repository.save(holiday));
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "save")
  @CachePut(value = "holiday", key = "#holidayDto.id()")
  @CacheEvict(value = "holiday", key = "'all'")
  public HolidayResponse update(
    @RequestPart @Valid HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    this.assertFileIsImage(cover);
    var filename = cover.getOriginalFilename();
    var path = Path.of("", "filestore", filename);
    cover.transferTo(path);

    Holiday holiday = this.repository.findById(holidayDto.id()).orElseThrow();
    holiday.setDescription(holidayDto.description());
    holiday.setName(holidayDto.name());
    holiday.setCoverPath(filename);
    return this.holidayMapper.holidayToResponse(this.repository.save(holiday));
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
  @Caching(
      evict = {
        @CacheEvict(value = "holiday", key = "#id"),
        @CacheEvict(value = "holiday", key = "'all'")
      })
  public void remove(@PathVariable("id") Long id) {
    this.repository.deleteById(id);
  }

  @GetMapping(
    value = "/{id}/cover",
    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
  )
  public ResponseEntity<Resource> viewCover(@PathVariable("id") Long id) {
    var holiday = this.repository.findById(id).orElseThrow();
    var cover = holiday.getCoverPath();
    if (cover == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cover not set");
    }
    var file = Path.of("", "filestore", cover);
    FileSystemResource resource = new FileSystemResource(file);
    return new ResponseEntity<>(resource, new HttpHeaders(), HttpStatus.OK);
  }

  @SneakyThrows
  private void assertFileIsImage(MultipartFile file) {
    if (!this.imageValidator.isFileImage(file.getInputStream())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        String.format("'%s' is not an image.", file.getName())
      );
    }
  }
}
