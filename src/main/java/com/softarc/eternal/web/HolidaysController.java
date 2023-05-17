package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayTrip;
import com.softarc.eternal.multimedia.ImageValidator;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import com.softarc.eternal.web.response.HolidayTripDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.SneakyThrows;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/holidays")
@RestController
@Tag(name = "Holidays")
public class HolidaysController {

  private final HolidaysRepository repository;
  private final ImageValidator imageValidator;

  public HolidaysController(
    HolidaysRepository repository,
    ImageValidator imageValidator
  ) {
    this.repository = repository;
    this.imageValidator = imageValidator;
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
    return this.repository.findById(id)
      .map(this::toHolidayResponse)
      .orElseThrow();
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "add")
  public boolean add(
    @RequestPart HolidayDto holidayDto,
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
      1L,
      Collections.emptyList(),
      null
    );
    this.repository.save(holiday);
    return true;
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "save")
  public void update(
    @RequestPart HolidayDto holidayDto,
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
    this.repository.save(holiday);
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
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
      throw new RuntimeException("Cover not set");
    }
    var file = Path.of("", "filestore", cover);
    FileSystemResource resource = new FileSystemResource(file);
    return new ResponseEntity<>(resource, new HttpHeaders(), HttpStatus.OK);
  }

  private HolidayResponse toHolidayResponse(Holiday holiday) {
    var trips = holiday.getTrips().stream().map(HolidayTrip::getId).toList();
    return new HolidayResponse(
      holiday.getId(),
      holiday.getName(),
      holiday.getDescription(),
      holiday.getCoverPath() != null,
      holiday
        .getTrips()
        .stream()
        .map(trip ->
          new HolidayTripDto(trip.getId(), trip.getFromDate(), trip.getToDate())
        )
        .collect(Collectors.toList())
    );
  }

  @SneakyThrows
  private void assertFileIsImage(MultipartFile file) {
    if (!this.imageValidator.isFileImage(file.getInputStream())) {
      throw new RuntimeException(
        String.format("'%s' is not an image.", file.getName())
      );
    }
  }
}
