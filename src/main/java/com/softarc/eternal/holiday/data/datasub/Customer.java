package com.softarc.eternal.holiday.data.datasub;

import java.time.LocalDate;
import lombok.Data;

@Data
public class Customer {
  private Long id;
  private String firstname;
  private String name;
  private String country;
  private LocalDate birthday;
}
