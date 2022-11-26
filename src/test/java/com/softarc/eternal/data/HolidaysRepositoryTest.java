package com.softarc.eternal.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.softarc.eternal.domain.HolidayMother;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class HolidaysRepositoryTest {

  @Autowired
  private HolidaysRepository repository;

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
