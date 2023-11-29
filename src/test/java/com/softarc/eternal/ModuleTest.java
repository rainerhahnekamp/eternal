package com.softarc.eternal;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

public class ModuleTest {
  @Test
  void testModules() {
    ApplicationModules.of(Application.class).forEach(System.out::println);
    ApplicationModules.of(Application.class).verify();
  }
}
