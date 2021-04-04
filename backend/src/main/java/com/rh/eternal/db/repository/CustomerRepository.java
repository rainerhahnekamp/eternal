package com.rh.eternal.db.repository;

import com.rh.eternal.db.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {}
