- [1. H2](#1-h2)
  - [1.1. Setup](#11-setup)
  - [1.2. Create the Tables and Insert Data](#12-create-the-tables-and-insert-data)
- [2. Repository](#2-repository)

# 1. H2

## 1.1. Setup

Setup an embedded database we can use for development purposes.

In IntelliJ, open the database window, click on _New_ (plus symbol) and select H2 from the available databases.

In _URL_ type in the following JDBC URL "jdbc:h2:./dev-db".

Also make sure that the drivers are available. IntelliJ will shows a link "Download missing drivers". Click on it, if it is shown.

Click on "Test Connection" to make sure IntelliJ can connect to the database.

If everything ran successfully, you should see new two files in your project's root folder:

- **deb-db.mv.db**
- **dev-db.trace.db**

In order to run the web console, add the following two dependencies to your **build.gradle**

```kotlin
implementation 'com.h2database:h2'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

Start Spring and navigate to _http://localhost:8080/h2-console_. You should see the H2 Console where you can try to connect. Make sure you use the right path.

## 1.2. Create the Tables and Insert Data

Close Spring, open the database view in IntelliJ again, click the "plus" symbol and open the "Query Console".

Insert the SQL to create the tables for `Holiday`, `HolidayTrip`, and `Guide`. You can try it on your own or copy it from **ddl-holidays.sql** from the **labs** directory.

Next add some holidays. Again, you can write your own SQL or copy from **dml.sql**.

To verify, that everything worked, run `select * from HOLIDAY`.

# 2. Repository

It is time to switch from the filesystem to the database. First, a hard cut is required. Since the term `Repository` has a special meaning in Spring Data, rename `HolidaysRepository` to just `Holidays`.

**Important**: Rename it automatically. Right click on the class name, select _Refactor_ and then _Rename..._.

Once that is done create a new interface `com.softarc.eternal.data.HolidaysRepository` which extends from Spring's `JpaRepository`.

The integration tests will connect to the h2 database. In order to avoid that, add the following configuration property to the `@SpringBootTest` annotation: `spring.datasource.url=jdbc:h2:mem:application-test`.

This will not access the file-based H2 but temporarily creates one in the memory.

The major changes you will have to do:

- `coverPath` in `Holiday` changes from type `Optional<String>` to `String`.
- Methods of the new `HolidaysRepository` have slightyl different names.
- Updating the tests

<details>
<summary>Show Solution</summary>
<p>

**application.yml**

```yaml
spring:
  datasource:
    url: jdbc:h2:./dev-db
    driver-class-name: org.h2.Driver
```

**HolidaysRepository.java**

```java
package com.softarc.eternal.data;

import com.softarc.eternal.domain.Holiday;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface HolidaysRepository extends CrudRepository<Holiday, Long> {
  List<Holiday> findAll();
}

```

**Holiday.java**

```java
package com.softarc.eternal.domain;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Holiday {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  @Column(name = "COVERPATH")
  private String coverPath;

  @Builder.Default
  @Transient
  private List<HolidayTrip> trips = new ArrayList<>();
}

```

**HolidaysController.java**

For the changes in the controller, please checkout the diff from branch **solution-4-data-2-entity**.

</p>
</details>
