package com.rh.eternal.web;

import com.rh.eternal.db.entity.UserEntity;
import com.rh.eternal.db.repository.UserRepository;
import com.rh.eternal.domain.User;
import com.rh.eternal.web.request.LoginRequest;
import com.rh.eternal.web.request.SignUpRequest;
import com.rh.eternal.web.response.SignUpResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("security")
@Log4j2
public class SecurityController {
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;

  SecurityController(AuthenticationManager authenticationManager, UserRepository userRepository) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
  }

  @PostMapping("sign-up")
  public SignUpResponse signUp(@RequestBody SignUpRequest signUpRequest) {

    UserEntity userEntity =
        new UserEntity(
            null,
            signUpRequest.getFirstname(),
            signUpRequest.getName(),
            signUpRequest.getEmail(),
            signUpRequest.getPassword(),
            RandomStringUtils.randomAlphanumeric(10),
            "007",
            false);
    UserEntity storedUserEntity = this.userRepository.save(userEntity);
    return new SignUpResponse(
        storedUserEntity.getId(),
        storedUserEntity.getActivationCode(),
        storedUserEntity.getActivationToken());
  }

  @PostMapping("activate-user-by-code/{id}/{activationCode}")
  public boolean activateUserByCode(@PathVariable Long id, @PathVariable String activationCode) {
    return userRepository
        .findByIdAndActivationCode(id, activationCode)
        .map(
            userEntity -> {
              userEntity.setActivated(true);
              userRepository.save(userEntity);
              return true;
            })
        .orElse(false);
  }

  @PostMapping("sign-in")
  public User signIn(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(), loginRequest.getPassword());
    Authentication authentication = authenticationManager.authenticate(authenticationToken);
    SecurityContext securityContext = SecurityContextHolder.getContext();
    securityContext.setAuthentication(authentication);
    HttpSession session = request.getSession(true);
    session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

    Principal principal =
        new Principal() {
          @Override
          public String getName() {
            return loginRequest.getEmail();
          }
        };
    return this.getUserInfo(principal);
  }

  @PostMapping("sign-out")
  public User signOut(HttpServletRequest request, HttpServletResponse response) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      new SecurityContextLogoutHandler().logout(request, response, authentication);
    }

    return User.anonymousUser;
  }

  @GetMapping("user-info")
  public User getUserInfo(Principal principal) {
    return Optional.ofNullable(principal)
        .map(Principal::getName)
        .map(this::mapByEmail)
        .orElse(User.anonymousUser);
  }

  private User mapByEmail(String email) {
    return userRepository
        .findByEmail(email)
        .map(
            userEntity ->
                new User(
                    userEntity.getId(),
                    userEntity.getEmail(),
                    userEntity.getFirstname(),
                    userEntity.getName(),
                    false))
        .orElseThrow(() -> new RuntimeException("unknown user with email " + email));
  }
}
