package com.softarc.eternal;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.web.bind.annotation.RestController;

@AnalyzeClasses(
  packages = "com.softarc.eternal",
  importOptions = ImportOption.DoNotIncludeTests.class
)
public class ArchitectureTest {

  @ArchTest
  public static final ArchRule noDependencyFromWebToDb = noClasses()
    .that()
    .resideInAPackage("com.softarc.eternal..web")
    .should()
    .dependOnClassesThat()
    .resideInAPackage("com.softarc.eternal..db");

  @ArchTest
  public static final ArchRule controllerNamesInWeb = classes()
    .that()
    .resideInAPackage("com.softarc.eternal..web")
    .should()
    .haveSimpleNameEndingWith("Controller");

  @ArchTest
  public static final ArchRule onlyRestControllers = classes()
    .that()
    .resideInAPackage("com.softarc.eternal..web")
    .should()
    .beAnnotatedWith(RestController.class);
}
