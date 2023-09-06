package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.multimedia.ImageValidator;
import com.softarc.eternal.web.exception.IdNotFoundException;
import com.softarc.eternal.web.mapping.HolidaysMapper;
import com.softarc.eternal.web.request.HolidayDto;
import com.softarc.eternal.web.response.HolidayResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.SneakyThrows;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RequestMapping("/api/holidays")
@RestController
@Tag(name = "Holidays")
public class HolidaysController {

  private final HolidaysRepository repository;
  private final HolidaysMapper holidaysMapper;
  private final ImageValidator imageValidator;

  public HolidaysController(
    HolidaysRepository repository,
    HolidaysMapper holidaysMapper,
    ImageValidator imageValidator
  ) {
    this.repository = repository;
    this.holidaysMapper = holidaysMapper;
    this.imageValidator = imageValidator;
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

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(operationId = "add")
  public boolean add(
    @RequestPart HolidayDto holidayDto,
    @RequestPart MultipartFile cover
  ) throws IOException {
    this.assertFileIsImage(cover);

    var filename = cover.getOriginalFilename();
    var path = Path.of("", "filestore", filename);
    this.repository.add(
      holidayDto.name(),
      holidayDto.description(),
      Optional.ofNullable(filename)
    );
    cover.transferTo(path);
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
    this.repository.update(
      holidayDto.id(),
      holidayDto.name(),
      holidayDto.description(),
      Optional.ofNullable(filename)
    );
    var path = Path.of("", "filestore", filename);
    cover.transferTo(path);
  }

  @DeleteMapping("{id}")
  @Operation(operationId = "remove")
  public void remove(@PathVariable("id") Long id) {
    this.repository.remove(id);
  }

  @GetMapping(
    value = "/{id}/cover",
    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
  )
  public ResponseEntity<Resource> viewCover(@PathVariable("id") Long id) {
    var holiday = this.repository.find(id).orElseThrow();
    var cover = holiday.getCoverPath().orElseThrow();
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
