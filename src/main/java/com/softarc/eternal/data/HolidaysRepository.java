package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

public interface HolidaysRepository
  extends
    JpaRepository<Holiday, Long>,
    QueryByExampleExecutor<Holiday>,
    JpaSpecificationExecutor<Holiday> {
  Optional<Holiday> findByName(String name);

  @Query(
    """
      select h from Holiday h inner join h.trips t
      where t.fromDate > current date
        and t.guide.lastname like :guideName"""
  )
  @EntityGraph(attributePaths = { "trips.guide" })
  List<Holiday> findUpcomingHolidays(String guideName);

  @Query("select h from Holiday h")
  List<HolidayTeaser> findTeasers();

  @Query(
    """
      select new com.softarc.eternal.data.HolidayWithGuide(h.id, h.name, concat(g.firstname, ' ', g.lastname))
      from Holiday h inner join h.trips t inner join t.guide g"""
  )
  List<HolidayWithGuide> findHolidayGuides();
}
