package com.softarc.eternal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
  properties = { "spring.datasource.url=jdbc:h2:mem:application-test" }
)
class ApplicationTests {

  @Test
  void contextLoads() {}
}
