package com.softarc.eternal.data;

import com.softarc.eternal.domain.Guide;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface GuideRepository extends CrudRepository<Guide, Long> {
  Optional<Guide> findByFirstname(String firstname);
}
