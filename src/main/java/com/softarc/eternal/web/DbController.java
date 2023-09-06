package com.softarc.eternal.web;

import com.softarc.eternal.data.HolidaySpecs;
import com.softarc.eternal.data.HolidayTeaser;
import com.softarc.eternal.data.HolidayWithGuide;
import com.softarc.eternal.data.HolidaysRepository;
import com.softarc.eternal.domain.Holiday;
import com.softarc.eternal.domain.HolidayTrip;
import com.softarc.eternal.web.response.HolidayDbResponse;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.java.Log;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("db")
@Log
public class DbController {

  private final HolidaysRepository repository;

  public DbController(HolidaysRepository repository) {
    this.repository = repository;
  }

  private static HolidayDbResponse apply(Holiday holiday) {
    return new HolidayDbResponse(
      holiday.getId(),
      holiday.getName(),
      holiday
        .getTrips()
        .stream()
        .map(HolidayTrip::getGuide)
        .map(guide ->
          String.format("%s %s", guide.getFirstname(), guide.getLastname())
        )
        .collect(Collectors.joining(", "))
    );
  }

  @GetMapping("upcoming")
  public List<HolidayDbResponse> upcomingHolidays() {
    return this.repository.findUpcomingHolidays("chen")
      .stream()
      .map(DbController::apply)
      .toList();
  }

  @GetMapping("teaser")
  public List<HolidayTeaser> teasers() {
    return this.repository.findTeasers();
  }

  @GetMapping("holidayGuide")
  public List<HolidayWithGuide> holidayWithGuides() {
    return this.repository.findHolidayGuides();
  }

  @GetMapping("count")
  public Long holidaysCount() {
    return this.repository.count();
  }

  @GetMapping("by-example")
  public List<String> byExample() {
    var holiday = new Holiday();
    holiday.setCoverPath("jpg");
    var exampleMatcher = ExampleMatcher
      .matching()
      .withMatcher("coverPath", matcher -> matcher.endsWith());

    var example = Example.of(holiday, exampleMatcher);

    return repository
      .findBy(example, q -> q.stream())
      .map(Holiday::getName)
      .toList();
  }

  @GetMapping("by-specification")
  public List<String> bySpecification() {
    return repository
      .findAll(HolidaySpecs.isJpgCover())
      .stream()
      .map(Holiday::getName)
      .toList();
  }

  @PostMapping("change-holiday")
  @Transactional
  public void changeHoliday() {
    var holiday = repository.findAll().stream().findFirst().orElseThrow();
    log.info("update");
    holiday.setName("Canada");
    repository.save(holiday);
  }

  @PostMapping("change-holiday-delayed")
  @Transactional
  public void changeHolidayDelayed() throws InterruptedException {
    var holiday = repository.findAll().stream().findFirst().orElseThrow();
    Thread.sleep(3000);
    log.info("delayed update");
    holiday.setName("Korea");
    repository.save(holiday);
  }
}
