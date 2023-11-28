package com.softarc.eternal.common;

import com.softarc.eternal.customer.web.exception.CustomerException;
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

  @ExceptionHandler(CustomerException.class)
  public ProblemDetail handleCustomerException() {
    return ProblemDetail.forStatusAndDetail(HttpStatus.ALREADY_REPORTED, "Error in Customers");
  }
}
