package com.softarc.eternal.customer.data;


import java.time.Instant;
import lombok.Builder;

@Builder
public record Customer(Long id, String firstname, String name, Boolean hasGdpr, Instant createdAt) {
  String getFullname() {
//    return STR."\{this.name}, \{this.firstname}";
    return String.format("%s, %s", this.name, this.firstname);
  }
}
