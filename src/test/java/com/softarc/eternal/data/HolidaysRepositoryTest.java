package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.softarc.eternal.domain.HolidayMother;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class HolidaysRepositoryTest {

  @Container
  @ServiceConnection
  static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.0.30");

  @Autowired
  private HolidaysRepository repository;

  @BeforeEach
  void removeHolidays() {
    repository.deleteAll();
  }

  @Test
  void testFindAll() {
    var vienna = HolidayMother.vienna().build();
    repository.save(vienna);
    assertThat(repository.findAll()).hasSize(1);
  }

  @Test
  void testCrud() {
    var vienna = HolidayMother.vienna().build();
    repository.save(vienna);
    var entities = repository.findAll();
    assertThat(entities).hasSize(1);
    var entity = entities.get(0);

    assertThat(vienna).isNotEqualTo(entity);
    entity.setName("Wien");
    repository.save(entity);

    var wien = repository.findById(entity.getId()).orElseThrow();
    assertThat(wien.getName()).isEqualTo("Wien");

    repository.deleteById(wien.getId());
    assertThat(repository.findAll()).hasSize(0);
  }

  @Test
  void testNonExistingHoliday() {
    assertThat(repository.findById(1L)).isEmpty();
  }

  @Test
  void testNoBlankName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() -> repository.save(HolidayMother.vienna().name("").build())
      );
  }

  @Test
  void testNoNullOnName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name(null).build())
      );
  }

  @ParameterizedTest
  @ValueSource(strings = { "Wr. Neustadt", "District 9", "Tromsø" })
  void testOnlyCharsAndSpaceOnName(String name) {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name(name).build())
      );
  }

  @Test
  void testMinSizeOfThreeOnName() {
    assertThatExceptionOfType(ConstraintViolationException.class)
      .isThrownBy(() ->
        repository.save(HolidayMother.vienna().name("Ro").build())
      );
  }
}
