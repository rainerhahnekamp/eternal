package com.softarc.eternal.holiday.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class OverlappingCalculatorTest {

  @ParameterizedTest
  @MethodSource("overlappingParametersProvider")
  public void testPreventGuideAssignmentToOverlappingTrips(
    OverlappingParameter overlappingParameter
  ) {
    var calculator = new OverlappingCalculator();
    var start1 = overlappingParameter
      .start1()
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end1 = start1.plus(
      overlappingParameter.durationInDays1(),
      ChronoUnit.DAYS
    );
    var start2 = overlappingParameter
      .start2()
      .atStartOfDay(ZoneOffset.UTC)
      .toInstant();
    var end2 = start2.plus(
      overlappingParameter.durationInDays2(),
      ChronoUnit.DAYS
    );

    assertThat(calculator.isOverlapping(start1, end1, start2, end2))
      .isEqualTo(overlappingParameter.isOverlapping());
  }

  static List<OverlappingParameter> overlappingParametersProvider() {
    return Arrays.asList(
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 1, 2),
        7,
        true
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 2, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 2, 1),
        7,
        LocalDate.of(2022, 1, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 2, 1),
        7,
        LocalDate.of(2022, 1, 1),
        7,
        false
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 1),
        7,
        LocalDate.of(2022, 1, 4),
        2,
        true
      ),
      new OverlappingParameter(
        LocalDate.of(2022, 1, 4),
        2,
        LocalDate.of(2022, 1, 1),
        7,
        true
      )
    );
  }
}
