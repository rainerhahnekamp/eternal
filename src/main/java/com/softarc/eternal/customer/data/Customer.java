package com.softarc.eternal.customer.data;


import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String firstname;
  private String name;
  private Boolean hasGdpr;
  private Instant createdAt;

  @ManyToOne()
  private Country country;

  String getFullname() {
//    return STR."\{this.name}, \{this.firstname}";
    return String.format("%s, %s", this.name, this.firstname);
  }

}

