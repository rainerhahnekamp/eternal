package com.softarc.eternal.web;

import com.softarc.eternal.web.exception.IdNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalControllerAdvice extends ResponseEntityExceptionHandler {

  @ExceptionHandler(IdNotFoundException.class)
  public ProblemDetail handleIdNotFound() {
    return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Wrong Id");
  }
}
