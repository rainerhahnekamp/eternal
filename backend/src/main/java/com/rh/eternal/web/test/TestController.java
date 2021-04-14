package com.rh.eternal.web.test;

import com.rh.eternal.web.SecurityController;
import com.rh.eternal.web.request.SignInRequest;
import com.rh.eternal.web.request.SignUpRequest;
import com.rh.eternal.web.response.SignUpResponse;
import com.rh.eternal.web.test.request.SignInAndCreateUserRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("test")
public class TestController {
  private final SecurityController securityController;

  public TestController(SecurityController securityController) {
    this.securityController = securityController;
  }

  @PostMapping("sign-in-and-create-user")
  public void signInAndCreateUser(
      @RequestBody SignInAndCreateUserRequest request, HttpServletRequest httpServletRequest) {
    SignUpRequest signUpRequest = new SignUpRequest();
    signUpRequest.setEmail(request.getEmail());
    signUpRequest.setPassword(request.getPassword());
    signUpRequest.setName(request.getName());

    SignUpResponse response = this.securityController.signUp(signUpRequest);

    this.securityController.activateUserByCode(response.getUserId(), "007");

    SignInRequest signInRequest = new SignInRequest();
    signInRequest.setEmail(request.getEmail());
    signInRequest.setPassword(request.getPassword());
    this.securityController.signIn(signInRequest, httpServletRequest);
  }
}
