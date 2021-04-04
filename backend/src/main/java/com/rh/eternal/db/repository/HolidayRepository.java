package com.rh.eternal.db.repository;

import com.rh.eternal.db.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {}
