package com.rh.eternal.db.repository;

import com.rh.eternal.db.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmail(String email);

  Optional<UserEntity> findByIdAndActivationCode(Long id, String activationCode);
}
