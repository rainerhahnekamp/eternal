package com.rh.eternal.security;

import com.rh.eternal.db.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EternalUserDetailsService implements UserDetailsService {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public EternalUserDetailsService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return this.userRepository
        .findByEmail(email)
        .map(
            userEntity ->
                new EternalUserDetail(
                    userEntity.getEmail(),
                    passwordEncoder.encode(userEntity.getPassword()),
                    true,
                    true,
                    true,
                    true))
        .orElseThrow(() -> new UsernameNotFoundException("non-existing user " + email));
  }
}
