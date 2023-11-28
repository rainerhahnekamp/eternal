package com.softarc.eternal.holiday.data;

import com.softarc.eternal.holiday.domain.Guide;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface GuideRepository extends CrudRepository<Guide, Long> {
  Optional<Guide> findByFirstname(String firstname);
}
