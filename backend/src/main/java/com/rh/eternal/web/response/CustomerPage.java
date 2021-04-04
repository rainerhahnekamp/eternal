package com.rh.eternal.web.response;

import com.rh.eternal.domain.Customer;
import lombok.Data;

import java.util.List;

@Data
public class CustomerPage {
  private List<Customer> content;
  private Integer totalPages;
}
