# DTOs

Our `POST` or `PUT` should be able to consume parts of the `Holiday` object.

For that purpose, create a `HolidayDto` `record` which only contains `id`, `name`, `description`. `HolidaysController` is repsonsible for mapping `Holiday` to `HolidayDto`. Make sure that `name` and `description` are required.

Create another `record`, called `HolidayResponse`, which is used as type by `/api/holidays` and `/api/holidays/{id}`. As a first step, it should have the same properties as the `HolidayDto`.

Since a `PUT` request allows us to update an existing `Holiday`, add `void update(Long id, String name, String description)` to `HolidaysRepository` and implement in both classes.

<details>
<summary>Show Solution</summary>
<p>

**/src/main/java/com/softarc/eternal/web/request/HolidayDto.java**

```java
package com.softarc.eternal.web.request;

public record HolidayDto(Long id, @NotNull String name, @NotNull String description) {}

```

**/src/main/java/com/softarc/eternal/web/request/HolidayDto.java**

```java
package com.softarc.eternal.web.response;

import jakarta.validation.constraints.NotNull;

public record HolidayResponse(
  @NotNull Long id,
  @NotNull String name,
  @NotNull String description
) {}

```

**HolidaysRepository.java**

```java

```

</p>
</details>

## Validated DTOs

Enable BeanValidation. In `HolidayDto`, `name` and `description` must not be null or an empty string.

For `HolidayResponse`, all properties must be required, i.e. not null.

Don't forget to make sure the `HolidaysController` validates the DTOs.

## WebTests


# DTOs

- Come up with DTOs and update the frontend code as well. Use HolidayDto, HolidayResponse
- GlobalAdvice and Explain Problem Http
- Caching
- JSONView
- WebTest

# WebTest with MvcClient

# OpenAPI & Integration

- Install OpenAPI
- Checkout the Swagger UI
- Generate the Frontend Module
- Add Bean Validation (HolidayDto and Holiday)
- Update the Frontend (HolidaysRepository and tsconfig.base)
- Change the type holiday in the frontend and verify it is failing
- Change the type url in the backend and verify it is failing (two times via TypeScript compiler but also via the WebTests)
- Add Annotations
- Data Type Mapping (Numbers, Enums, HolidayTrip)
-

# Upload and Download

- Upload
- OpenApi Anpassung
- Optional
- Fix Tests
-
- File Type Check
- Serving Files
-
- Progress
- Quota Check

# Further Exercises

- Static Serving of Files
- Filters (LoggingFilter)
- Cookies
- ResponseEntity
