package com.softarc.eternal.customer.domain;

import com.softarc.eternal.customer.data.Country;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
  Optional<Country> findFirstByName(String name);
}
