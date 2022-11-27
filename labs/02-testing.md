# Unit Tests `FsHolidaysRepository`

# Create ObjectMother for `Holiday`

Write unit tests for `DefaultHolidaysRepository`. Try to come with 100% test coverage. You might have to refactor for testing a little bit.

- Add `HolidayTrip` and `Guide`.

CRUD Tests

# Add HolidayTrip

# Add Guide

# Add Guide with Overlapping

# Add Parameterized Guide with Overlapping

# Extract Overlapping to class and mock it

# Spring Web Test `/api/holidays/`

## Unit Test

- Verify that FsHolidaysRepository is used
  - Set Profile and verify `DefaultHolidaysRepository` is used
  - Use `@MockBean`
- Write Integration Tests

  - Verify Repository Bean
  - Set Profile
  - Set Configuration Parameter

- Measure Test Coverage

# Further Exercises

- Code Coverage via jacoco with thresholds
- Try to write an E2E test which covers the frontend, backend and the persistence layer (most of the times a database)
